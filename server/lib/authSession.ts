import type { Request } from 'express';
import { normalizeAppRole, type AppRole } from '../../shared/authRoles';
import { serverEnv } from './env';
import { adminAuth, adminDb } from './supabaseAdmin';

export type AuthenticatedActor = {
  uid: string;
  email: string | null;
  name: string;
  role: AppRole;
  emailVerified: boolean;
};

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEmail(value: string | null | undefined) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

const allowedAdminEmails = new Set(
  serverEnv.adminAllowedEmails
    .map((email) => normalizeEmail(email))
    .filter(Boolean),
);

function inferAdminRole(email: string | null, emailVerified: boolean) {
  if (!emailVerified) {
    return null;
  }

  return allowedAdminEmails.has(normalizeEmail(email)) ? ('admin' satisfies AppRole) : null;
}

function inferUserName(input: {
  storedName?: unknown;
  tokenName?: string | null;
  email?: string | null;
}) {
  return sanitizeString(input.storedName) || sanitizeString(input.tokenName) || sanitizeString(input.email) || 'Unknown User';
}

export function readBearerToken(req: Request) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice('Bearer '.length).trim();
}

export async function resolveAuthenticatedActor(token: string) {
  const decodedToken = await adminAuth.verifyIdToken(token);
  const userRef = adminDb.collection('users').doc(decodedToken.uid);
  const userSnapshot = await userRef.get();
  const userData = userSnapshot.exists ? (userSnapshot.data() ?? {}) : {};

  const storedRole = normalizeAppRole(userData.role);
  const inferredRole = inferAdminRole(decodedToken.email, decodedToken.email_verified);
  const role = (
    inferredRole && (!storedRole || storedRole === 'patient')
      ? inferredRole
      : storedRole || inferredRole || 'patient'
  ) as AppRole;
  const email = decodedToken.email ?? null;
  const name = inferUserName({
    storedName: userData.name,
    tokenName: decodedToken.name,
    email,
  });
  const now = new Date().toISOString();

  const nextUserDocument: Record<string, unknown> = {
    uid: decodedToken.uid,
    email,
    name,
    role,
    lastLoginAt: now,
    updatedAt: now,
  };

  if (!userSnapshot.exists) {
    nextUserDocument.createdAt = now;
    await userRef.set(nextUserDocument, { merge: true });
  } else {
    const currentEmail = sanitizeString(userData.email) || null;
    const currentName = sanitizeString(userData.name);
    const patch: Record<string, unknown> = {
      lastLoginAt: now,
      updatedAt: now,
    };

    if (email && currentEmail !== email) {
      patch.email = email;
    }
    if (name && currentName !== name) {
      patch.name = name;
    }
    if (role && storedRole !== role) {
      patch.role = role;
    }

    if (Object.keys(patch).length > 0) {
      await userRef.set(patch, { merge: true });
    }
  }

  return {
    uid: decodedToken.uid,
    email,
    name,
    role,
    emailVerified: decodedToken.email_verified,
  } satisfies AuthenticatedActor;
}

export async function getAuthenticatedActor(req: Request, required = true) {
  const token = readBearerToken(req);
  if (!token) {
    if (!required) {
      return null;
    }

    throw new Error('Authentication required.');
  }

  return resolveAuthenticatedActor(token);
}

import { createClient } from '@supabase/supabase-js';
import { FieldValue, Timestamp, applyConstraints, applyDocumentMutation, createDocumentId, fetchCollectionRows, fetchDocumentRow, insertDocumentRow, materializeRow, toStoredData, upsertDocumentRow, type FirestoreComparisonOperator, type QueryConstraint } from '../../shared/documentStore';
import { serverEnv } from './env';

const supabaseUrl = serverEnv.supabaseUrl || 'https://invalid-project.supabase.co';
const supabaseSecretKey =
  serverEnv.supabaseSecretKey || serverEnv.supabasePublishableKey || 'invalid-secret-key';

export const adminSupabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

type SupabaseDecodedToken = {
  uid: string;
  email: string | null;
  email_verified: boolean;
  name: string | null;
};

class AdminDocumentSnapshot {
  readonly id: string;
  readonly exists: boolean;
  private readonly row: ReturnType<typeof materializeRow> | null;

  constructor(collection: string, id: string, row: ReturnType<typeof materializeRow> | null) {
    this.id = id;
    this.row = row?.collection === collection ? row : null;
    this.exists = Boolean(this.row);
  }

  data() {
    return this.row ? { ...this.row.data } : undefined;
  }
}

class AdminQuerySnapshot {
  readonly docs: AdminDocumentSnapshot[];

  constructor(rows: Array<ReturnType<typeof materializeRow>>) {
    this.docs = rows.map((row) => new AdminDocumentSnapshot(row.collection, row.id, row));
  }

  get empty() {
    return this.docs.length === 0;
  }

  get size() {
    return this.docs.length;
  }
}

class AdminDocumentReference {
  readonly collection: string;
  readonly id: string;

  constructor(collection: string, id: string) {
    this.collection = collection;
    this.id = id;
  }

  async get() {
    const row = await fetchDocumentRow(adminSupabase, this.collection, this.id);
    return new AdminDocumentSnapshot(this.collection, this.id, row ? materializeRow(row) : null);
  }

  async set(data: Record<string, unknown>, options?: { merge?: boolean }) {
    const existingRow = await fetchDocumentRow(adminSupabase, this.collection, this.id);
    const existingData = existingRow ? materializeRow(existingRow).data : null;
    const nextData = applyDocumentMutation(existingData, data, options?.merge ? 'merge' : 'set');
    const now = new Date().toISOString();

    await upsertDocumentRow(adminSupabase, {
      collection: this.collection,
      id: this.id,
      data: toStoredData(nextData),
      created_at: existingRow?.created_at ?? now,
      updated_at: now,
    });
  }
}

class AdminQueryReference {
  readonly collection: string;
  readonly constraints: QueryConstraint[];

  constructor(collection: string, constraints: QueryConstraint[] = []) {
    this.collection = collection;
    this.constraints = constraints;
  }

  where(fieldPath: string, operator: FirestoreComparisonOperator, value: unknown) {
    return new AdminQueryReference(this.collection, [
      ...this.constraints,
      {
        type: 'where',
        fieldPath,
        operator,
        value,
      },
    ]);
  }

  orderBy(fieldPath: string, direction: 'asc' | 'desc' = 'asc') {
    return new AdminQueryReference(this.collection, [
      ...this.constraints,
      {
        type: 'orderBy',
        fieldPath,
        direction,
      },
    ]);
  }

  limit(count: number) {
    return new AdminQueryReference(this.collection, [
      ...this.constraints,
      {
        type: 'limit',
        count,
      },
    ]);
  }

  async get() {
    const rows = await fetchCollectionRows(adminSupabase, this.collection);
    const materialized = rows.map((row) => materializeRow(row));
    const filteredRows = applyConstraints(materialized, this.constraints);
    return new AdminQuerySnapshot(filteredRows);
  }
}

class AdminCollectionReference extends AdminQueryReference {
  constructor(collection: string) {
    super(collection, []);
  }

  doc(id: string) {
    return new AdminDocumentReference(this.collection, id);
  }

  async add(data: Record<string, unknown>) {
    const id = createDocumentId();
    const now = new Date().toISOString();
    const nextData = applyDocumentMutation(null, data, 'set');

    await insertDocumentRow(adminSupabase, {
      collection: this.collection,
      id,
      data: toStoredData(nextData),
      created_at: now,
      updated_at: now,
    });

    return this.doc(id);
  }
}

function inferUserName(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  const metadata = user.user_metadata ?? {};
  const rawName = metadata.full_name || metadata.name || metadata.user_name;
  return typeof rawName === 'string' ? rawName : user.email ?? null;
}

export const adminAuth = {
  async verifyIdToken(token: string): Promise<SupabaseDecodedToken> {
    const { data, error } = await adminSupabase.auth.getUser(token);
    if (error || !data.user) {
      throw error ?? new Error('Authentication required.');
    }

    return {
      uid: data.user.id,
      email: data.user.email ?? null,
      email_verified: Boolean(data.user.email_confirmed_at),
      name: inferUserName(data.user),
    };
  },
};

export const adminDb = {
  collection(collectionName: string) {
    return new AdminCollectionReference(collectionName);
  },
};

export { FieldValue, Timestamp };

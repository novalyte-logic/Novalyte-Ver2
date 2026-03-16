import express from 'express';
import { canAccessClinicWorkspace, isAdminRole } from '../../shared/authRoles';
import { getAuthenticatedActor } from '../lib/authSession';
import { deliverSubmissionAlert } from '../lib/correspondence';
import { adminDb } from '../lib/supabaseAdmin';

const router = express.Router();

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => sanitizeString(entry))
    .filter(Boolean);
}

async function notifySubmission(input: Parameters<typeof deliverSubmissionAlert>[0]) {
  try {
    await deliverSubmissionAlert(input);
  } catch (error) {
    console.error('Auth route submission alert failed:', error);
  }
}

router.get('/session', async (req, res) => {
  try {
    const actor = await getAuthenticatedActor(req, true);
    if (!actor) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    return res.json({
      user: {
        uid: actor.uid,
        email: actor.email,
        name: actor.name,
        emailVerified: actor.emailVerified,
      },
      role: actor.role,
      capabilities: {
        isAdmin: isAdminRole(actor.role),
        isClinicUser: canAccessClinicWorkspace(actor.role),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed.';
    const status = message === 'Authentication required.' ? 401 : 500;
    if (status >= 500) {
      console.error('Auth session route failed:', error);
    }
    return res.status(status).json({ error: message });
  }
});

router.post('/clinic-registration', async (req, res) => {
  try {
    const actor = await getAuthenticatedActor(req, true);
    if (!actor) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const body = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>) : {};
    const legalName = sanitizeString(body.legalName);
    const npiNumber = sanitizeString(body.npiNumber);
    const adminEmail = sanitizeString(body.adminEmail) || actor.email || '';

    if (legalName.length < 2) {
      return res.status(400).json({ error: 'Legal clinic name is required.' });
    }
    if (npiNumber.length < 10) {
      return res.status(400).json({ error: 'A valid NPI number is required.' });
    }
    if (!adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
      return res.status(400).json({ error: 'A valid admin email is required.' });
    }

    const now = new Date().toISOString();
    await adminDb.collection('users').doc(actor.uid).set(
      {
        uid: actor.uid,
        email: actor.email,
        name: actor.name,
        role: 'clinic',
        updatedAt: now,
      },
      { merge: true },
    );

    await adminDb.collection('clinics').doc(actor.uid).set(
      {
        name: legalName,
        npiNumber,
        taxId: sanitizeString(body.taxId),
        email: adminEmail,
        hipaaOfficer: sanitizeString(body.hipaaOfficer),
        hipaaEmail: sanitizeString(body.hipaaEmail),
        baaAccepted: body.baaAccepted === true,
        dataResidency: sanitizeString(body.dataResidency) || 'us-east',
        primaryEmr: sanitizeString(body.primaryEmr),
        telehealth: sanitizeString(body.telehealth),
        monthlyVolume: sanitizeString(body.monthlyVolume),
        hl7Capable: sanitizeString(body.hl7Capable),
        webhookUrl: sanitizeString(body.webhookUrl),
        techContact: sanitizeString(body.techContact),
        specialties: sanitizeStringArray(body.specialties),
        status: 'pending',
        outreachStatus: 'Onboarding',
        icpDefined: false,
        billingSetup: false,
        medicalDirectorVerified: false,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );

    await notifySubmission({
      category: 'clinic_registration',
      title: 'Clinic registration submitted',
      entityType: 'clinic',
      entityId: actor.uid,
      summary: `${legalName} submitted clinic onboarding details and is pending review.`,
      route: '/api/auth/clinic-registration',
      replyTo: adminEmail,
      adminPath: '/admin/directory',
      emailFields: [
        { label: 'Clinic ID', value: actor.uid },
        { label: 'Legal Name', value: legalName },
        { label: 'Admin Email', value: adminEmail },
        { label: 'NPI', value: npiNumber },
        { label: 'Primary EMR', value: sanitizeString(body.primaryEmr) || 'Not provided' },
        { label: 'Monthly Volume', value: sanitizeString(body.monthlyVolume) || 'Not provided' },
        { label: 'Review Status', value: 'pending' },
      ],
      slackFields: [
        { label: 'Clinic ID', value: actor.uid },
        { label: 'Clinic', value: legalName },
        { label: 'Admin Email', value: adminEmail },
        { label: 'Status', value: 'pending' },
      ],
      metadata: {
        clinicId: actor.uid,
        status: 'pending',
      },
    });

    return res.status(201).json({
      success: true,
      clinicId: actor.uid,
      status: 'pending',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Clinic registration failed.';
    const status = message === 'Authentication required.' ? 401 : 500;
    if (status >= 500) {
      console.error('Clinic registration route failed:', error);
    }
    return res.status(status).json({ error: message });
  }
});

export default router;

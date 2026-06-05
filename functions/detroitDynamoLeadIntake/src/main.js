import { Client, Databases, ID } from 'node-appwrite';

const DB_ID = process.env.APPWRITE_DATABASE_ID || 'lctraining';
const CONTACT_LEADS = 'dd_contact_leads';
const TRYOUT_REGISTRATIONS = 'dd_tryout_registrations';
const SPONSORS = 'dd_sponsors';
const PLAYERS = 'dd_players';
const PARENT_GUARDIANS = 'dd_parent_guardians';
const BOOKINGS = 'dd_bookings';

const allowedLeadTypes = ['contact', 'training', 'youth', 'tryout', 'men', 'women', 'sponsor'];
const tryoutLeadTypes = ['youth', 'tryout', 'men', 'women'];
const ownerRoleByLeadType = {
  contact: 'Media/Admin Staff',
  training: 'Training Director',
  youth: 'Registrar',
  tryout: 'Registrar',
  men: 'Club Director',
  women: 'Club Director',
  sponsor: 'Media/Admin Staff',
};

function cleanText(value, max = 20000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function cleanEmail(value) {
  return cleanText(value, 320).toLowerCase();
}

function cleanPhone(value) {
  return cleanText(value, 30).replace(/[^\d+]/g, '').slice(0, 30);
}

function dateToIso(value) {
  const text = cleanText(value, 30);
  if (!text) return null;
  const parsed = text.length === 10 ? new Date(`${text}T00:00:00.000Z`) : new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function addHours(isoDate, hours) {
  const parsed = new Date(isoDate);
  return new Date(parsed.getTime() + hours * 36e5).toISOString();
}

function initialPipelineFields(leadType, now) {
  return {
    pipeline_status: 'new',
    pipeline_owner_role: ownerRoleByLeadType[leadType] || ownerRoleByLeadType.contact,
    pipeline_due_at: addHours(now, 4),
    pipeline_updated_at: now,
    pipeline_last_note: 'New public Detroit Dynamo form intake captured.',
    pipeline_event_count: 0,
  };
}

function defaultTeamInterest(leadType, explicit) {
  const value = cleanText(explicit, 120);
  if (value) return value;
  if (leadType === 'men') return "Senior Men's Team";
  if (leadType === 'women') return "Senior Women's Team";
  if (leadType === 'youth') return 'Youth Club';
  return 'Training Evaluation';
}

function required(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function compactDocument(document) {
  return Object.fromEntries(
    Object.entries(document).filter(([_key, value]) => value !== '' && value !== null && value !== undefined),
  );
}

function splitName(value, fallbackFirst, fallbackLast) {
  const parts = cleanText(value, 200).split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || fallbackFirst,
    lastName: parts.slice(1).join(' ') || fallbackLast,
  };
}

function detailLine(label, value) {
  const text = Array.isArray(value) ? value.filter(Boolean).join(', ') : cleanText(value, 1000);
  return text ? `${label}: ${text}` : '';
}

function buildLeadMessage(payload) {
  const lines = [
    detailLine('Program interest', payload.program_interest),
    detailLine('Team interest', payload.team_interest),
    detailLine('Age group', payload.age_group),
    detailLine('Position', payload.position),
    detailLine('Experience level', payload.experience_level),
    detailLine('Current/previous club', payload.current_club || payload.current_previous_club),
    detailLine('Package interest', payload.package_interest),
    cleanText(payload.notes, 20000),
  ].filter(Boolean);

  return cleanText(lines.join('\n'), 20000);
}

function bookingFocus(payload) {
  const lines = [
    detailLine('Program interest', payload.program_interest),
    detailLine('Player name', payload.player_name),
    detailLine('Age group', payload.age_group),
    detailLine('Requested focus', payload.notes),
  ].filter(Boolean);

  return cleanText(lines.join('\n'), 20000);
}

function parseBody(req) {
  if (req.bodyJson && typeof req.bodyJson === 'object') return req.bodyJson;
  if (typeof req.body === 'string' && req.body.trim()) return JSON.parse(req.body);
  return {};
}

function validatePayload(payload) {
  const leadType = cleanText(payload.lead_type, 32);
  const email = cleanEmail(payload.email);
  const errors = [];

  if (!allowedLeadTypes.includes(leadType)) errors.push('lead_type is invalid');
  if (!email || !email.includes('@')) errors.push('email is required');
  if (!cleanText(payload.source_route, 255).startsWith('/detroit-dynamo')) {
    errors.push('source_route must be a Detroit Dynamo route');
  }

  if (tryoutLeadTypes.includes(leadType)) {
    if (!required(payload.player_name)) errors.push('player_name is required');
    if (!dateToIso(payload.date_of_birth)) errors.push('date_of_birth is required');
    if (!required(payload.position)) errors.push('position is required');
    if (!required(payload.experience_level)) errors.push('experience_level is required');
    if (!cleanPhone(payload.phone)) errors.push('phone is required');
  } else if (leadType === 'sponsor') {
    if (!required(payload.organization)) errors.push('organization is required');
    if (!required(payload.package_interest)) errors.push('package_interest is required');
  } else if (leadType === 'training') {
    if (!required(payload.contact_name)) errors.push('contact_name is required');
    if (!required(payload.program_interest)) errors.push('program_interest is required');
  } else if (!required(payload.contact_name)) {
    errors.push('contact_name is required');
  }

  return { leadType, email, errors };
}

export default async ({ req, res, error }) => {
  try {
    const payload = parseBody(req);
    const { leadType, email, errors } = validatePayload(payload);
    if (errors.length) return res.json({ error: 'Invalid Detroit Dynamo lead payload', errors }, 400);

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const now = new Date().toISOString();
    const contactName = cleanText(payload.contact_name || payload.parent_guardian_name || payload.player_name || payload.organization, 200);
    const phone = cleanPhone(payload.phone);
    const notes = buildLeadMessage(payload);
    const pipelineFields = initialPipelineFields(leadType, now);

    const contactLead = await databases.createDocument(DB_ID, CONTACT_LEADS, ID.unique(), compactDocument({
      lead_type: leadType,
      contact_name: contactName,
      email,
      phone,
      player_name: cleanText(payload.player_name, 200),
      organization: cleanText(payload.organization, 200),
      message: notes,
      source_route: cleanText(payload.source_route, 255),
      status: 'new',
      ...pipelineFields,
      created_at: now,
      updated_at: now,
    }));

    const created = {
      contact_lead_id: contactLead.$id,
      player_id: null,
      parent_guardian_id: null,
      booking_id: null,
      tryout_registration_id: null,
      sponsor_id: null,
    };

    if (leadType === 'training') {
      const booking = await databases.createDocument(DB_ID, BOOKINGS, ID.unique(), compactDocument({
        status: 'lead',
        requested_focus: bookingFocus(payload),
        source_lead_id: contactLead.$id,
        ...pipelineFields,
        created_at: now,
        updated_at: now,
      }));
      created.booking_id = booking.$id;
    }

    if (tryoutLeadTypes.includes(leadType)) {
      const playerName = splitName(payload.player_name, 'Player', 'Lead');
      const player = await databases.createDocument(DB_ID, PLAYERS, ID.unique(), compactDocument({
        first_name: playerName.firstName,
        last_name: playerName.lastName,
        date_of_birth: dateToIso(payload.date_of_birth),
        gender: cleanText(payload.gender, 64),
        primary_position: cleanText(payload.position, 64),
        current_club: cleanText(payload.current_club || payload.current_previous_club, 255),
        experience_level: cleanText(payload.experience_level, 64),
        status: 'lead',
        source_lead_id: contactLead.$id,
        created_at: now,
        updated_at: now,
      }));
      created.player_id = player.$id;

      if (required(payload.parent_guardian_name)) {
        const guardianName = splitName(payload.parent_guardian_name, 'Parent', 'Guardian');
        const guardian = await databases.createDocument(DB_ID, PARENT_GUARDIANS, ID.unique(), compactDocument({
          first_name: guardianName.firstName,
          last_name: guardianName.lastName,
          email,
          phone,
          relationship: 'Parent',
          player_ids: [player.$id],
          communication_preferences: ['email'],
          status: 'active',
          created_at: now,
          updated_at: now,
        }));
        created.parent_guardian_id = guardian.$id;
      }

      const tryout = await databases.createDocument(DB_ID, TRYOUT_REGISTRATIONS, ID.unique(), compactDocument({
        player_name: cleanText(payload.player_name, 200),
        parent_guardian_name: cleanText(payload.parent_guardian_name, 200),
        date_of_birth: dateToIso(payload.date_of_birth),
        team_interest: defaultTeamInterest(leadType, payload.team_interest),
        gender: cleanText(payload.gender, 64),
        position: cleanText(payload.position, 64),
        current_previous_club: cleanText(payload.current_club || payload.current_previous_club, 255),
        experience_level: cleanText(payload.experience_level, 64),
        email,
        phone,
        notes,
        status: 'new',
        source_lead_id: contactLead.$id,
        ...pipelineFields,
        created_at: now,
        updated_at: now,
      }));
      created.tryout_registration_id = tryout.$id;
    }

    if (leadType === 'sponsor') {
      const sponsor = await databases.createDocument(DB_ID, SPONSORS, ID.unique(), compactDocument({
        business_name: cleanText(payload.organization, 200),
        contact_name: contactName,
        email,
        phone,
        package_interest: cleanText(payload.package_interest, 150),
        website_url: cleanText(payload.website_url, 1000),
        status: 'lead',
        source_lead_id: contactLead.$id,
        ...pipelineFields,
        created_at: now,
        updated_at: now,
      }));
      created.sponsor_id = sponsor.$id;
    }

    return res.json({
      success: true,
      lead_type: leadType,
      created,
    });
  } catch (err) {
    error(`detroitDynamoLeadIntake: ${err?.message || err}`);
    return res.json({
      error: 'Detroit Dynamo lead intake failed',
      detail: err?.message || String(err),
    }, 500);
  }
};

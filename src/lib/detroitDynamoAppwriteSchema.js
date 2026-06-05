import {
  detroitDynamoAdminRoles,
  detroitDynamoCollectionPlan,
  detroitDynamoDataModels,
  detroitDynamoLeadPipelineStages,
} from './detroitDynamoDataModel.js';

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Multiple / Unsure'];
const experienceLevels = ['Beginner', 'Developing', 'Club', 'High school', 'College', 'Semi-pro / pro-development'];
const genders = ['Male', 'Female', 'Coed / Open', 'Prefer not to say'];
const leadTypes = ['contact', 'training', 'youth', 'tryout', 'men', 'women', 'sponsor'];
const pillars = ['Training Academy', 'Youth Club', 'Senior Men', 'Senior Women', 'Club Operations'];
const currencies = ['USD'];
const publicIntakeModels = ['ContactLead', 'TryoutRegistration', 'Sponsor', 'Player', 'ParentGuardian', 'Booking'];
const leadPipelineStatuses = detroitDynamoLeadPipelineStages.map((stage) => stage.status);
const detroitDynamoModelNames = Object.keys(detroitDynamoDataModels);

const text = (key, size = 255, options = {}) => ({ key, type: 'string', size, ...options });
const longText = (key, options = {}) => text(key, 20000, options);
const email = (key, options = {}) => ({ key, type: 'email', ...options });
const datetime = (key, options = {}) => ({ key, type: 'datetime', ...options });
const bool = (key, options = {}) => ({ key, type: 'boolean', ...options });
const integer = (key, options = {}) => ({ key, type: 'integer', ...options });
const float = (key, options = {}) => ({ key, type: 'float', ...options });
const enm = (key, elements, options = {}) => ({ key, type: 'enum', elements, ...options });
const idRef = (key, options = {}) => text(key, 64, options);
const idArray = (key, options = {}) => text(key, 64, { array: true, ...options });

const commonLifecycle = [
  datetime('created_at'),
  datetime('updated_at'),
];

const leadPipelineLifecycle = (defaultOwnerRole) => [
  enm('pipeline_status', leadPipelineStatuses, { default: 'new' }),
  text('pipeline_owner_role', 100, { default: defaultOwnerRole }),
  datetime('pipeline_due_at'),
  datetime('pipeline_updated_at'),
  longText('pipeline_last_note'),
  integer('pipeline_event_count', { min: 0, default: 0 }),
];

const leadPipelineIndexes = [
  { key: 'idx_pipeline_status', type: 'key', attributes: ['pipeline_status'] },
  { key: 'idx_pipeline_owner', type: 'key', attributes: ['pipeline_owner_role'] },
  { key: 'idx_pipeline_due', type: 'key', attributes: ['pipeline_due_at'] },
];

const schemaByModel = {
  Player: {
    attributes: [
      text('first_name', 100, { required: true }),
      text('last_name', 100, { required: true }),
      datetime('date_of_birth', { required: true }),
      enm('gender', genders),
      enm('primary_position', positions),
      enm('secondary_position', positions),
      text('current_club', 255),
      enm('experience_level', experienceLevels),
      idArray('team_ids'),
      idArray('guardian_ids'),
      longText('medical_notes'),
      enm('waiver_status', ['not_started', 'pending', 'signed', 'expired', 'needs_review'], { default: 'not_started' }),
      enm('status', ['lead', 'active', 'inactive', 'archived'], { default: 'lead' }),
      idRef('source_lead_id'),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_birth_date', type: 'key', attributes: ['date_of_birth'] },
      { key: 'idx_primary_position', type: 'key', attributes: ['primary_position'] },
    ],
  },
  ParentGuardian: {
    attributes: [
      text('first_name', 100, { required: true }),
      text('last_name', 100, { required: true }),
      email('email', { required: true }),
      text('phone', 30),
      enm('relationship', ['Parent', 'Guardian', 'Relative', 'Other']),
      idArray('player_ids'),
      text('communication_preferences', 100, { array: true }),
      enm('status', ['active', 'inactive', 'archived'], { default: 'active' }),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_email', type: 'key', attributes: ['email'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },
  Coach: {
    attributes: [
      text('first_name', 100, { required: true }),
      text('last_name', 100, { required: true }),
      email('email'),
      text('phone', 30),
      enm('role', ['Head Coach', 'Assistant Coach', 'Trainer', 'Goalkeeper Coach', 'Director', 'Team Manager']),
      text('licenses', 100, { array: true }),
      text('specialties', 100, { array: true }),
      idArray('team_ids'),
      idArray('program_ids'),
      longText('bio'),
      text('photo_url', 1000),
      enm('background_check_status', ['not_started', 'pending', 'approved', 'expired', 'rejected'], { default: 'not_started' }),
      bool('is_active', { default: true }),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_email', type: 'key', attributes: ['email'] },
      { key: 'idx_active', type: 'key', attributes: ['is_active'] },
      { key: 'idx_role', type: 'key', attributes: ['role'] },
    ],
  },
  Team: {
    attributes: [
      text('name', 150, { required: true }),
      enm('program_pillar', pillars, { required: true }),
      enm('gender', genders),
      text('age_group', 64),
      text('season', 64),
      enm('league_status', ['future_pathway', 'exploring', 'confirmed', 'inactive'], { default: 'future_pathway' }),
      idArray('coach_ids'),
      idArray('manager_ids'),
      idArray('player_ids'),
      enm('tryout_status', ['not_open', 'interest_open', 'tryouts_scheduled', 'invite_only', 'closed'], { default: 'interest_open' }),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_pillar', type: 'key', attributes: ['program_pillar'] },
      { key: 'idx_age_group', type: 'key', attributes: ['age_group'] },
      { key: 'idx_league_status', type: 'key', attributes: ['league_status'] },
    ],
  },
  Program: {
    attributes: [
      text('name', 150, { required: true }),
      enm('pillar', pillars, { required: true }),
      longText('description'),
      text('age_range', 100),
      enm('skill_level', ['Foundation', 'Developing', 'Competitive', 'Senior', 'Open']),
      text('season', 64),
      bool('is_public', { default: true }),
      text('cta_route', 255),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_pillar', type: 'key', attributes: ['pillar'] },
      { key: 'idx_public', type: 'key', attributes: ['is_public'] },
    ],
  },
  TrainingPackage: {
    attributes: [
      text('name', 150, { required: true }),
      integer('session_count', { required: true, min: 1 }),
      integer('duration_minutes', { required: true, min: 15 }),
      float('price', { min: 0 }),
      enm('currency', currencies, { default: 'USD' }),
      idRef('program_id'),
      bool('is_visible', { default: false }),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_visible', type: 'key', attributes: ['is_visible'] },
      { key: 'idx_program', type: 'key', attributes: ['program_id'] },
    ],
  },
  TrainingSession: {
    attributes: [
      idRef('coach_id'),
      idArray('player_ids'),
      idRef('program_id'),
      datetime('starts_at', { required: true }),
      datetime('ends_at'),
      text('location', 255),
      text('focus_areas', 100, { array: true }),
      enm('status', ['requested', 'confirmed', 'completed', 'cancelled', 'no_show'], { default: 'requested' }),
      longText('coach_notes'),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_coach', type: 'key', attributes: ['coach_id'] },
      { key: 'idx_starts_at', type: 'key', attributes: ['starts_at'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },
  Booking: {
    attributes: [
      idRef('player_id'),
      idRef('guardian_id'),
      idRef('coach_id'),
      idRef('training_package_id'),
      idArray('session_ids'),
      idRef('payment_id'),
      enm('status', ['lead', 'requested', 'confirmed', 'paid', 'completed', 'cancelled'], { default: 'lead' }),
      longText('requested_focus'),
      idRef('source_lead_id'),
      ...leadPipelineLifecycle('Training Director'),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_player', type: 'key', attributes: ['player_id'] },
      { key: 'idx_coach', type: 'key', attributes: ['coach_id'] },
      ...leadPipelineIndexes,
    ],
  },
  TryoutRegistration: {
    attributes: [
      text('player_name', 200, { required: true }),
      text('parent_guardian_name', 200),
      datetime('date_of_birth', { required: true }),
      enm('team_interest', ['Youth Club', "Senior Men's Team", "Senior Women's Team", 'Training Evaluation'], { required: true }),
      enm('gender', genders),
      enm('position', positions),
      text('current_previous_club', 255),
      enm('experience_level', experienceLevels),
      email('email', { required: true }),
      text('phone', 30, { required: true }),
      longText('notes'),
      enm('status', ['new', 'reviewing', 'invited', 'waitlist', 'closed'], { default: 'new' }),
      idRef('source_lead_id'),
      ...leadPipelineLifecycle('Registrar'),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_team_interest', type: 'key', attributes: ['team_interest'] },
      { key: 'idx_email', type: 'key', attributes: ['email'] },
      ...leadPipelineIndexes,
    ],
  },
  CampClinic: {
    attributes: [
      text('name', 150, { required: true }),
      enm('type', ['Seasonal Camp', 'Summer Training', 'Winter Indoor', 'Speed/Agility', 'Finishing', 'Goalkeeper']),
      text('season', 64),
      text('age_range', 100),
      datetime('starts_at'),
      datetime('ends_at'),
      text('location', 255),
      integer('capacity', { min: 0 }),
      float('price', { min: 0 }),
      enm('registration_status', ['draft', 'interest_open', 'open', 'waitlist', 'closed'], { default: 'interest_open' }),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_type', type: 'key', attributes: ['type'] },
      { key: 'idx_registration_status', type: 'key', attributes: ['registration_status'] },
      { key: 'idx_starts_at', type: 'key', attributes: ['starts_at'] },
    ],
  },
  Payment: {
    attributes: [
      idRef('payer_profile_id'),
      float('amount', { required: true, min: 0 }),
      enm('currency', currencies, { default: 'USD' }),
      enm('provider', ['stripe', 'paypal', 'cash', 'external']),
      text('provider_payment_id', 255),
      enm('status', ['pending', 'paid', 'failed', 'refunded', 'cancelled'], { default: 'pending' }),
      enm('related_record_type', ['Booking', 'TrainingPackage', 'CampClinic', 'Sponsor', 'TeamFee', 'Other']),
      idRef('related_record_id'),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_provider_payment', type: 'key', attributes: ['provider_payment_id'] },
      { key: 'idx_related', type: 'key', attributes: ['related_record_type', 'related_record_id'] },
    ],
  },
  Waiver: {
    attributes: [
      idRef('player_id'),
      idRef('guardian_id'),
      enm('waiver_type', ['training', 'tryout', 'camp', 'youth_club', 'media_release', 'medical', 'travel']),
      text('version', 50),
      datetime('signed_at'),
      datetime('expires_at'),
      enm('status', ['not_sent', 'sent', 'signed', 'expired', 'void'], { default: 'not_sent' }),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_player', type: 'key', attributes: ['player_id'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_type', type: 'key', attributes: ['waiver_type'] },
    ],
  },
  Sponsor: {
    attributes: [
      text('business_name', 200, { required: true }),
      text('contact_name', 200),
      email('email'),
      text('phone', 30),
      text('package_interest', 150),
      text('logo_url', 1000),
      text('website_url', 1000),
      enm('status', ['lead', 'contacted', 'proposal_sent', 'active', 'declined', 'archived'], { default: 'lead' }),
      idRef('source_lead_id'),
      ...leadPipelineLifecycle('Media/Admin Staff'),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_email', type: 'key', attributes: ['email'] },
      ...leadPipelineIndexes,
    ],
  },
  NewsPost: {
    attributes: [
      text('title', 200, { required: true }),
      text('slug', 180, { required: true }),
      longText('excerpt'),
      longText('body'),
      text('hero_image_url', 1000),
      enm('category', ['Club', 'Training', 'Youth Club', 'Senior Men', 'Senior Women', 'Camps', 'Sponsors', 'Media']),
      datetime('published_at'),
      enm('status', ['draft', 'review', 'published', 'archived'], { default: 'draft' }),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_slug', type: 'unique', attributes: ['slug'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_published_at', type: 'key', attributes: ['published_at'] },
    ],
  },
  MatchFixture: {
    attributes: [
      idRef('team_id'),
      text('opponent', 200, { required: true }),
      datetime('starts_at'),
      text('venue', 255),
      enm('home_away', ['home', 'away', 'neutral']),
      text('competition', 150),
      enm('status', ['draft', 'scheduled', 'postponed', 'cancelled', 'final'], { default: 'draft' }),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_team', type: 'key', attributes: ['team_id'] },
      { key: 'idx_starts_at', type: 'key', attributes: ['starts_at'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },
  MatchResult: {
    attributes: [
      idRef('fixture_id', { required: true }),
      idRef('team_id'),
      text('opponent', 200),
      integer('goals_for', { min: 0 }),
      integer('goals_against', { min: 0 }),
      enm('result', ['W', 'L', 'D', 'Forfeit', 'No Contest']),
      text('recap_url', 1000),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_fixture', type: 'unique', attributes: ['fixture_id'] },
      { key: 'idx_team', type: 'key', attributes: ['team_id'] },
    ],
  },
  ContactLead: {
    attributes: [
      enm('lead_type', leadTypes, { required: true }),
      text('contact_name', 200),
      email('email', { required: true }),
      text('phone', 30),
      text('player_name', 200),
      text('organization', 200),
      longText('message'),
      text('source_route', 255),
      enm('status', ['new', 'triaged', 'assigned', 'closed', 'archived'], { default: 'new' }),
      ...leadPipelineLifecycle('Media/Admin Staff'),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_lead_type', type: 'key', attributes: ['lead_type'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_email', type: 'key', attributes: ['email'] },
      ...leadPipelineIndexes,
    ],
  },
  AdminAuditEvent: {
    attributes: [
      idRef('actor_user_id', { required: true }),
      enm('actor_role', detroitDynamoAdminRoles, { required: true }),
      text('action', 120, { required: true }),
      enm('target_model', detroitDynamoModelNames, { required: true }),
      text('target_collection_id', 120, { required: true }),
      idRef('target_record_id', { required: true }),
      enm('previous_status', leadPipelineStatuses),
      enm('next_status', leadPipelineStatuses),
      longText('event_summary'),
      longText('metadata_json'),
      text('ip_address', 120),
      datetime('created_at', { required: true }),
    ],
    indexes: [
      { key: 'idx_actor', type: 'key', attributes: ['actor_user_id'] },
      { key: 'idx_actor_role', type: 'key', attributes: ['actor_role'] },
      { key: 'idx_action', type: 'key', attributes: ['action'] },
      { key: 'idx_target', type: 'key', attributes: ['target_model', 'target_record_id'] },
      { key: 'idx_created_at', type: 'key', attributes: ['created_at'] },
    ],
  },
  AdminRoleAssignment: {
    attributes: [
      idRef('actor_user_id', { required: true }),
      email('email'),
      enm('role', detroitDynamoAdminRoles, { required: true }),
      enm('status', ['invited', 'active', 'suspended', 'revoked'], { default: 'active' }),
      idRef('assigned_by_user_id'),
      datetime('assigned_at', { required: true }),
      datetime('expires_at'),
      longText('scope_note'),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_actor_role', type: 'key', attributes: ['actor_user_id', 'role'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_role', type: 'key', attributes: ['role'] },
      { key: 'idx_expires_at', type: 'key', attributes: ['expires_at'] },
    ],
  },
  StaffMember: {
    attributes: [
      text('first_name', 100, { required: true }),
      text('last_name', 100, { required: true }),
      text('title', 150),
      enm('department', ['Leadership', 'Training', 'Youth Club', 'Senior Teams', 'Operations', 'Media']),
      longText('bio'),
      text('photo_url', 1000),
      email('email'),
      integer('display_order', { default: 0 }),
      bool('is_public', { default: false }),
      ...commonLifecycle,
    ],
    indexes: [
      { key: 'idx_public', type: 'key', attributes: ['is_public'] },
      { key: 'idx_department', type: 'key', attributes: ['department'] },
      { key: 'idx_display_order', type: 'key', attributes: ['display_order'] },
    ],
  },
};

export const detroitDynamoAppwriteCollections = detroitDynamoCollectionPlan.map((plan) => ({
  ...plan,
  name: `Detroit Dynamo ${plan.model}`,
  accessPolicy: plan.model === 'AdminAuditEvent'
    ? 'server_function_append_admin_read'
    : plan.model === 'AdminRoleAssignment'
      ? 'master_admin_manage_function_read'
    : publicIntakeModels.includes(plan.model)
      ? 'server_function_create_admin_read'
      : 'authenticated_admin_staff',
  writePath: publicIntakeModels.includes(plan.model)
    ? 'detroitDynamoLeadIntake public form function'
    : plan.model === 'AdminAuditEvent'
      ? 'protected Appwrite functions only'
      : plan.model === 'AdminRoleAssignment'
        ? 'Master Admin grants plus protected Appwrite functions'
      : 'future protected admin dashboard',
  attributes: schemaByModel[plan.model]?.attributes || [],
  indexes: schemaByModel[plan.model]?.indexes || [],
}));

export function validateDetroitDynamoAppwriteSchema() {
  const errors = [];
  const schemasByModel = new Map(detroitDynamoAppwriteCollections.map((collection) => [collection.model, collection]));

  for (const [model, fields] of Object.entries(detroitDynamoDataModels)) {
    const collection = schemasByModel.get(model);
    if (!collection) {
      errors.push(`No Appwrite collection schema for ${model}`);
      continue;
    }

    const attributeKeys = new Set(collection.attributes.map((attribute) => attribute.key));
    for (const field of fields) {
      if (field === 'id') continue;
      if (!attributeKeys.has(field)) {
        errors.push(`${model}.${field} is missing from Appwrite attributes`);
      }
    }

    for (const index of collection.indexes) {
      for (const attribute of index.attributes) {
        if (!attributeKeys.has(attribute)) {
          errors.push(`${model} index ${index.key} references unknown attribute ${attribute}`);
        }
      }
    }
  }

  return errors;
}

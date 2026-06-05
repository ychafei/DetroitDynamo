import { detroitDynamoAppwriteCollections } from './detroitDynamoAppwriteSchema.js';
import {
  buildDetroitDynamoCollectionDisplayProfile,
  buildDetroitDynamoModuleRecordCsv,
  buildDetroitDynamoPreparedRecordPayload,
  buildDetroitDynamoRecordFieldRows,
  flattenDetroitDynamoModuleRecordCollections,
  getDetroitDynamoRecordTitle,
  labelDetroitDynamoRecordField,
  stringifyDetroitDynamoRecordValue,
} from './detroitDynamoAdminRecordWorkspace.js';

const workspaceFixtureCollections = [
  {
    collection_id: 'dd_players',
    model: 'Player',
    documents: [
      {
        id: 'player-ava-01',
        title: 'Ava "The Standard" Rivera',
        first_name: 'Ava',
        last_name: 'Rivera',
        date_of_birth: '2011-05-01T00:00:00.000Z',
        primary_position: 'Midfielder',
        status: 'active',
        pipeline_status: 'qualified',
        updated_at: '2026-05-29T00:00:00.000Z',
      },
      {
        id: 'player-missing-dob',
        title: 'Required Field Review Player',
        first_name: 'Review',
        last_name: 'Player',
        status: 'lead',
      },
    ],
  },
  {
    collection_id: 'dd_sponsors',
    model: 'Sponsor',
    documents: [
      {
        id: 'sponsor-detroit-01',
        business_name: 'Detroit Partner Co.',
        contact_name: 'Maya Chen',
        email: 'maya@example.com',
        status: 'new',
        source: 'sponsor_form',
      },
    ],
  },
];

function collectionById() {
  return new Map(detroitDynamoAppwriteCollections.map((collection) => [collection.collectionId, collection]));
}

export function buildDetroitDynamoAdminRecordWorkspaceReport() {
  const collections = collectionById();
  const playerCollection = collections.get('dd_players');
  const sponsorCollection = collections.get('dd_sponsors');
  const flattenedRecords = flattenDetroitDynamoModuleRecordCollections(workspaceFixtureCollections);
  const completePlayer = flattenedRecords.find((record) => record.id === 'player-ava-01');
  const incompletePlayer = flattenedRecords.find((record) => record.id === 'player-missing-dob');
  const sponsorRecord = flattenedRecords.find((record) => record.id === 'sponsor-detroit-01');
  const completePlayerProfile = buildDetroitDynamoCollectionDisplayProfile(completePlayer, playerCollection);
  const incompletePlayerProfile = buildDetroitDynamoCollectionDisplayProfile(incompletePlayer, playerCollection);
  const completePlayerFields = buildDetroitDynamoRecordFieldRows(completePlayer, playerCollection);
  const sponsorFields = buildDetroitDynamoRecordFieldRows(sponsorRecord, sponsorCollection);
  const csv = buildDetroitDynamoModuleRecordCsv(flattenedRecords);
  const preparedUpdate = buildDetroitDynamoPreparedRecordPayload(completePlayer, 'update_record');
  const preparedArchive = buildDetroitDynamoPreparedRecordPayload(completePlayer, 'archive_record');

  return {
    checkedAt: new Date().toISOString(),
    fixtureCollections: workspaceFixtureCollections,
    flattenedRecords,
    csv,
    csvHeader: csv.split('\n')[0],
    completePlayerProfile,
    incompletePlayerProfile,
    completePlayerFields,
    sponsorFields,
    preparedUpdate,
    preparedArchive,
    helperOutputs: {
      explicitTitle: completePlayer?.title || '',
      sponsorTitleFallback: getDetroitDynamoRecordTitle({ organization: 'Fallback Sponsor' }),
      arrayString: stringifyDetroitDynamoRecordValue(['A', 'B']),
      emptyString: stringifyDetroitDynamoRecordValue(null),
      dateLabel: labelDetroitDynamoRecordField('date_of_birth'),
    },
    coveredHelpers: [
      'flattenDetroitDynamoModuleRecordCollections',
      'buildDetroitDynamoModuleRecordCsv',
      'buildDetroitDynamoRecordFieldRows',
      'buildDetroitDynamoCollectionDisplayProfile',
      'buildDetroitDynamoPreparedRecordPayload',
      'stringifyDetroitDynamoRecordValue',
      'labelDetroitDynamoRecordField',
    ],
  };
}

function assertReport(condition, message, issues) {
  if (!condition) issues.push(message);
}

export function auditDetroitDynamoAdminRecordWorkspaceReport(report = buildDetroitDynamoAdminRecordWorkspaceReport()) {
  const issues = [];
  const completePlayer = report.flattenedRecords.find((record) => record.id === 'player-ava-01');

  assertReport(report.flattenedRecords.length === 3, `Expected 3 flattened records, found ${report.flattenedRecords.length}.`, issues);
  assertReport(completePlayer?.title === 'Ava "The Standard" Rivera', 'Record title fallback should preserve explicit title values.', issues);
  assertReport(completePlayer?.searchText.includes('dd_players') && completePlayer.searchText.includes('qualified'), 'Flattened record search text should include collection and status signals.', issues);
  assertReport(report.helperOutputs.sponsorTitleFallback === 'Fallback Sponsor', 'Record title fallback should support sponsor organization names.', issues);
  assertReport(report.helperOutputs.arrayString === 'A, B', 'Record value stringifier should format arrays.', issues);
  assertReport(report.helperOutputs.emptyString === 'Not set', 'Record value stringifier should label empty values.', issues);
  assertReport(report.helperOutputs.dateLabel === 'Date Of Birth', 'Record field labels should convert snake_case keys.', issues);
  assertReport(report.csvHeader === '"record_id","collection_id","model","title","status","source","updated_at","payload_json"', 'CSV export should include the expected header row.', issues);
  assertReport(report.csv.includes('Ava ""The Standard"" Rivera'), 'CSV export should escape quote characters in record titles.', issues);
  assertReport(report.completePlayerFields.some((field) => field.key === 'date_of_birth' && field.required && field.indexed), 'Field rows should mark required and indexed schema fields.', issues);
  assertReport(report.sponsorFields.some((field) => field.key === 'business_name' && field.required), 'Sponsor field rows should mark required business_name field.', issues);
  assertReport(report.completePlayerProfile.missingRequiredFieldCount === 0, 'Complete player should have no missing required fields.', issues);
  assertReport(report.incompletePlayerProfile.missingRequiredFields.includes('date_of_birth'), 'Incomplete player should report missing date_of_birth.', issues);
  assertReport(report.completePlayerProfile.unknownFieldCount >= 1, 'Profile should count payload-only fields such as title.', issues);
  assertReport(!Object.prototype.hasOwnProperty.call(report.preparedUpdate, 'id'), 'Prepared update payload should omit id.', issues);
  assertReport(report.preparedUpdate.source === 'protected-module-record-workspace', 'Prepared update payload should include workspace source.', issues);
  assertReport(report.preparedArchive.status === 'archived' && report.preparedArchive.previous_status === 'active', 'Prepared archive payload should archive and retain previous status.', issues);

  return issues;
}

export function buildDetroitDynamoAdminRecordWorkspaceMarkdown(report = buildDetroitDynamoAdminRecordWorkspaceReport()) {
  return `# Detroit Dynamo Admin Record Workspace Verification

- Checked at: ${report.checkedAt}
- Collections covered: ${report.fixtureCollections.length}
- Flattened records covered: ${report.flattenedRecords.length}
- CSV header: \`${report.csvHeader}\`
- Complete player missing required fields: ${report.completePlayerProfile.missingRequiredFieldCount}
- Incomplete player missing required fields: ${report.incompletePlayerProfile.missingRequiredFields.join(', ')}
- Prepared archive status: ${report.preparedArchive.status}

This verification exercises the reusable protected admin record workspace helper without network calls.
`;
}

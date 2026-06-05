export function stringifyDetroitDynamoRecordValue(value) {
  if (value === null || value === undefined || value === '') return 'Not set';
  if (Array.isArray(value)) {
    return value.length ? value.map((item) => stringifyDetroitDynamoRecordValue(item)).join(', ') : 'None';
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function getDetroitDynamoRecordTitle(document) {
  return document.title
    || document.player_name
    || document.contact_name
    || document.organization
    || document.team_name
    || document.program_name
    || document.package_name
    || document.name
    || document.headline
    || document.email
    || document.id
    || 'Module record';
}

export function flattenDetroitDynamoModuleRecordCollections(collections) {
  return (collections || []).flatMap((collection) => (
    (collection.documents || []).map((document, index) => {
      const documentData = document || {};
      const recordId = documentData.id || documentData.$id || `record-${index + 1}`;
      const title = getDetroitDynamoRecordTitle(documentData);
      const status = documentData.status || documentData.pipeline_status || documentData.availability_status || 'preview';
      const updatedAt = documentData.updated_at || documentData.pipeline_updated_at || documentData.created_at || documentData.$updatedAt || '';
      const source = documentData.source || documentData.lead_type || documentData.module_action || 'module_record';
      const searchText = [
        recordId,
        title,
        status,
        source,
        collection.collection_id,
        collection.model,
        JSON.stringify(documentData),
      ].join(' ').toLowerCase();

      return {
        key: `${collection.collection_id}:${recordId}:${index}`,
        id: recordId,
        title,
        status,
        source,
        updatedAt,
        collectionId: collection.collection_id,
        model: collection.model || 'Module record',
        document: documentData,
        searchText,
      };
    })
  ));
}

function csvCell(value) {
  const text = stringifyDetroitDynamoRecordValue(value).replaceAll('"', '""');
  return `"${text}"`;
}

export function buildDetroitDynamoModuleRecordCsv(records) {
  const rows = [
    ['record_id', 'collection_id', 'model', 'title', 'status', 'source', 'updated_at', 'payload_json'],
    ...records.map((record) => [
      record.id,
      record.collectionId,
      record.model,
      record.title,
      record.status,
      record.source,
      record.updatedAt,
      JSON.stringify(record.document),
    ]),
  ];

  return rows.map((row) => row.map(csvCell).join(',')).join('\n');
}

function hasRecordValue(value) {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function labelDetroitDynamoRecordField(key) {
  return String(key || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getDetroitDynamoRecordFieldGroup(key) {
  if (key === 'id' || key === '$id' || key.endsWith('_id') || key.endsWith('_ids')) return 'Identity';
  if (key.startsWith('pipeline_')) return 'Pipeline';
  if (key.endsWith('_at') || key === 'created_at' || key === 'updated_at') return 'Lifecycle';
  if (key.includes('email') || key.includes('phone') || key.includes('contact')) return 'Contact';
  if (key.includes('status') || key.includes('role') || key.includes('level') || key.includes('position')) return 'Operations';
  return 'Profile';
}

export function buildDetroitDynamoRecordFieldRows(record, collectionPlan) {
  const document = record?.document || {};
  const attributes = collectionPlan?.attributes || [];
  const schemaByKey = new Map(attributes.map((attribute, index) => [attribute.key, { ...attribute, index }]));
  const indexedKeys = new Set((collectionPlan?.indexes || []).flatMap((index) => index.attributes || []));

  return Object.entries(document)
    .map(([key, value], fallbackIndex) => {
      const schemaField = schemaByKey.get(key);
      return {
        key,
        label: labelDetroitDynamoRecordField(key),
        value,
        group: getDetroitDynamoRecordFieldGroup(key),
        type: schemaField?.type || 'payload',
        required: Boolean(schemaField?.required),
        indexed: indexedKeys.has(key),
        array: Boolean(schemaField?.array),
        schemaOrder: schemaField?.index ?? attributes.length + fallbackIndex,
      };
    })
    .sort((a, b) => (
      a.schemaOrder - b.schemaOrder
      || a.group.localeCompare(b.group)
      || a.key.localeCompare(b.key)
    ));
}

export function buildDetroitDynamoCollectionDisplayProfile(record, collectionPlan) {
  const attributes = collectionPlan?.attributes || [];
  const schemaKeys = new Set(attributes.map((attribute) => attribute.key));
  const documentKeys = Object.keys(record?.document || {});
  const indexedKeys = new Set((collectionPlan?.indexes || []).flatMap((index) => index.attributes || []));
  const missingRequiredFields = attributes
    .filter((attribute) => attribute.required && !hasRecordValue(record?.document?.[attribute.key]))
    .map((attribute) => attribute.key);

  return {
    schemaFieldCount: attributes.length,
    requiredFieldCount: attributes.filter((attribute) => attribute.required).length,
    missingRequiredFields,
    missingRequiredFieldCount: missingRequiredFields.length,
    indexedFieldCount: indexedKeys.size,
    unknownFieldCount: documentKeys.filter((key) => !schemaKeys.has(key) && key !== 'id' && key !== '$id').length,
  };
}

export function buildDetroitDynamoPreparedRecordPayload(record, mutation) {
  if (mutation === 'archive_record') {
    return {
      status: 'archived',
      previous_status: record?.status || record?.document?.status || '',
      source: 'protected-module-record-workspace',
    };
  }

  const payload = { ...(record?.document || {}) };
  delete payload.id;
  delete payload.$id;
  return {
    ...payload,
    source: 'protected-module-record-workspace',
  };
}

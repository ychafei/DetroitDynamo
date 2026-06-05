import {
  detroitDynamoAppwriteCollections,
  validateDetroitDynamoAppwriteSchema,
} from '../src/lib/detroitDynamoAppwriteSchema.js';

const asJson = process.argv.includes('--json');
const errors = validateDetroitDynamoAppwriteSchema();

if (errors.length) {
  console.error('Detroit Dynamo Appwrite schema validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

if (asJson) {
  console.log(JSON.stringify(detroitDynamoAppwriteCollections, null, 2));
  process.exit(0);
}

const collectionCount = detroitDynamoAppwriteCollections.length;
const attributeCount = detroitDynamoAppwriteCollections.reduce((sum, collection) => sum + collection.attributes.length, 0);
const indexCount = detroitDynamoAppwriteCollections.reduce((sum, collection) => sum + collection.indexes.length, 0);

console.log('Detroit Dynamo Appwrite collection plan');
console.log(`Collections: ${collectionCount}`);
console.log(`Attributes: ${attributeCount}`);
console.log(`Indexes: ${indexCount}`);
console.log('');

for (const collection of detroitDynamoAppwriteCollections) {
  console.log(`[${collection.collectionId}] ${collection.name}`);
  console.log(`  model: ${collection.model}`);
  console.log(`  phase: ${collection.phase}`);
  console.log(`  owner: ${collection.ownerRole}`);
  console.log(`  access: ${collection.accessPolicy}`);
  console.log(`  write path: ${collection.writePath}`);
  console.log(`  attributes: ${collection.attributes.length}`);
  console.log(`  indexes: ${collection.indexes.map((index) => index.key).join(', ') || 'none'}`);
  console.log('');
}

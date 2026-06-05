// scripts/provision-detroit-dynamo-appwrite.mjs
//
// Idempotent provisioner for the Detroit Dynamo Appwrite scaffold.
// Defaults to dry-run so the preview can be reviewed without mutating the
// current Detroit Dynamo backend. Pass --apply to create the isolated dd_*
// collections, attributes, and indexes in the existing lctraining database.
//
// Usage:
//   node scripts/provision-detroit-dynamo-appwrite.mjs
//   node scripts/provision-detroit-dynamo-appwrite.mjs --apply
//
// Env for --apply (read from .env.local):
//   VITE_APPWRITE_ENDPOINT
//   VITE_APPWRITE_PROJECT_ID
//   APPWRITE_API_KEY

import { Client, Databases, Permission, Role } from 'node-appwrite';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  detroitDynamoAppwriteCollections,
  validateDetroitDynamoAppwriteSchema,
} from '../src/lib/detroitDynamoAppwriteSchema.js';

const DB_ID = 'lctraining';
const APPLY = process.argv.includes('--apply');
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
const errors = validateDetroitDynamoAppwriteSchema();

if (errors.length) {
  console.error('Detroit Dynamo Appwrite schema validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

function loadEnv() {
  try {
    const envContent = readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.error(`Could not read ${envPath}. Make sure .env.local exists in the project root.`);
    process.exit(1);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function safe(label, fn) {
  try {
    const result = await fn();
    console.log(`  ✓ ${label}`);
    return result;
  } catch (err) {
    if (err && (err.code === 409 || /already exists/i.test(err.message || ''))) {
      console.log(`  = ${label} (exists)`);
      return null;
    }
    console.error(`  ✗ ${label}: ${err?.message || err}`);
    throw err;
  }
}

function permissionsFor(accessPolicy) {
  const adminStaff = [
    Permission.read(Role.users()),
    Permission.create(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ];

  if (accessPolicy === 'server_function_create_admin_read') {
    return [
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  if (accessPolicy === 'server_function_append_admin_read') {
    return [
      Permission.read(Role.users()),
    ];
  }

  return adminStaff;
}

function defaultValue(attribute) {
  return Object.prototype.hasOwnProperty.call(attribute, 'default') ? attribute.default : null;
}

async function createAttribute(databases, collectionId, attribute) {
  const required = Boolean(attribute.required);
  const fallback = defaultValue(attribute);
  const array = Boolean(attribute.array);

  if (attribute.type === 'string') {
    return databases.createStringAttribute(DB_ID, collectionId, attribute.key, attribute.size || 255, required, fallback, array);
  }
  if (attribute.type === 'email') {
    return databases.createEmailAttribute(DB_ID, collectionId, attribute.key, required, fallback, array);
  }
  if (attribute.type === 'datetime') {
    return databases.createDatetimeAttribute(DB_ID, collectionId, attribute.key, required, fallback, array);
  }
  if (attribute.type === 'boolean') {
    return databases.createBooleanAttribute(DB_ID, collectionId, attribute.key, required, fallback, array);
  }
  if (attribute.type === 'integer') {
    return databases.createIntegerAttribute(
      DB_ID,
      collectionId,
      attribute.key,
      required,
      attribute.min ?? null,
      attribute.max ?? null,
      fallback,
      array,
    );
  }
  if (attribute.type === 'float') {
    return databases.createFloatAttribute(
      DB_ID,
      collectionId,
      attribute.key,
      required,
      attribute.min ?? null,
      attribute.max ?? null,
      fallback,
      array,
    );
  }
  if (attribute.type === 'enum') {
    return databases.createEnumAttribute(DB_ID, collectionId, attribute.key, attribute.elements, required, fallback, array);
  }

  throw new Error(`Unsupported Appwrite attribute type "${attribute.type}" for ${collectionId}.${attribute.key}`);
}

async function waitAttributesReady(databases, collectionId, timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const list = await databases.listAttributes(DB_ID, collectionId);
    const pending = list.attributes.filter((attribute) => attribute.status !== 'available');
    if (pending.length === 0) return;
    await sleep(1500);
  }
  throw new Error(`Timed out waiting for attributes in collection "${collectionId}"`);
}

function printDryRun() {
  const attributeCount = detroitDynamoAppwriteCollections.reduce((sum, collection) => sum + collection.attributes.length, 0);
  const indexCount = detroitDynamoAppwriteCollections.reduce((sum, collection) => sum + collection.indexes.length, 0);

  console.log('Detroit Dynamo Appwrite provisioner dry-run');
  console.log(`Database: ${DB_ID}`);
  console.log(`Collections: ${detroitDynamoAppwriteCollections.length}`);
  console.log(`Attributes: ${attributeCount}`);
  console.log(`Indexes: ${indexCount}`);
  console.log('');
  console.log('No backend changes were made. Re-run with --apply to create the isolated dd_* collections.');
  console.log('');

  for (const collection of detroitDynamoAppwriteCollections) {
    console.log(`[would create] ${collection.collectionId} (${collection.model})`);
    console.log(`  attributes: ${collection.attributes.length}`);
    console.log(`  indexes: ${collection.indexes.map((index) => index.key).join(', ') || 'none'}`);
    console.log(`  access: ${collection.accessPolicy}`);
  }
}

async function applyProvisioning() {
  loadEnv();

  const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT;
  const PROJECT = process.env.VITE_APPWRITE_PROJECT_ID;
  const API_KEY = process.env.APPWRITE_API_KEY;

  if (!ENDPOINT || !PROJECT || !API_KEY) {
    console.error('Missing required env vars. Need: VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, APPWRITE_API_KEY');
    process.exit(1);
  }

  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT).setKey(API_KEY);
  const databases = new Databases(client);

  console.log(`Provisioning Detroit Dynamo Appwrite collections on project ${PROJECT}`);
  console.log(`Database: ${DB_ID}`);
  await safe(`database "${DB_ID}"`, () => databases.create(DB_ID, 'LCTraining'));

  for (const collection of detroitDynamoAppwriteCollections) {
    console.log(`\n[Collection] ${collection.collectionId}`);
    await safe(`collection "${collection.collectionId}"`, () =>
      databases.createCollection(DB_ID, collection.collectionId, collection.name, permissionsFor(collection.accessPolicy)),
    );

    for (const attribute of collection.attributes) {
      await safe(`${collection.collectionId}.${attribute.key} ${attribute.type}`, () =>
        createAttribute(databases, collection.collectionId, attribute),
      );
    }

    await waitAttributesReady(databases, collection.collectionId);

    for (const index of collection.indexes) {
      await safe(`${collection.collectionId} index ${index.key}`, () =>
        databases.createIndex(
          DB_ID,
          collection.collectionId,
          index.key,
          index.type,
          index.attributes,
          index.orders || [],
        ),
      );
    }
  }

  console.log('\nDetroit Dynamo Appwrite provisioning complete.');
}

if (APPLY) {
  await applyProvisioning();
} else {
  printDryRun();
}

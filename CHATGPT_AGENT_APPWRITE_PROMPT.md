# ChatGPT Agent-Mode Prompt — Safe Appwrite Schema Setup

## How to use this

1. Open ChatGPT in **agent mode** (browser/computer-use).
2. Make sure you are already logged into the **Appwrite Console** in the browser the
   agent will use (the agent should not need your password).
3. Copy **everything inside the code block below** and paste it as the agent's task.
4. When it finishes, it will give you a CREATED / ALREADY EXISTED / ERROR checklist.
   Then run the verification steps at the bottom of this file yourself.

### Why this is safe

- The prompt is **additive-only**: the agent is told to use *Create* actions exclusively
  and to **never delete, rename, retype, or edit existing attributes, collections,
  indexes, buckets, documents, or permissions**.
- It does **no manual data backfill**. Your app already treats a missing value as the
  default (`coach_type → 'private_training'`, `application_type → 'general'`), so there
  is no reason for the agent to ever touch a production row. This removes the only
  real data-loss path.
- It must stop and report on any ambiguity or error rather than guess.

> Note: a non-agent alternative exists — extending the repo's existing idempotent
> `scripts/provision-appwrite.mjs` and running it locally. Not used here per your choice.

---

## The prompt (copy everything below)

```
ROLE & SCOPE
You are operating the Appwrite Console web UI in a browser. You are making additive-only
schema changes to an existing PRODUCTION database. Your job is done entirely inside the
Appwrite Console. You do not have and do not need any source code.

ABSOLUTE RULES — read before acting
1. NEVER delete, rename, disable, or change the type/size/required/array setting of any
   EXISTING attribute, collection, index, bucket, document, permission, or setting.
2. NEVER edit or delete any existing document/row. Do not "backfill" data by hand.
3. Only ever use the "Create attribute", "Create collection", and "Create index" actions.
4. If an attribute, collection, or index with the exact key/ID below ALREADY EXISTS,
   SKIP it — leave it exactly as is. Do not recreate or edit it.
5. If anything is ambiguous, the project/database can't be found, a name doesn't match,
   or you see an error — STOP IMMEDIATELY and report. Do not improvise or guess.
6. Touch only the collections named below. Do not open or modify any other collection.

STEP 0 — Verify you are in the right place (do this first)
- Open the Appwrite Console. Confirm the project is "LCTraining" (project ID
  69efb263000fe1c34344). If it is not, STOP and report.
- Go to Databases and open the database with ID "lctraining". If it does not exist,
  STOP and report. Do NOT create a new database.

STEP 1 — Add 2 attributes to the EXISTING collection `coaches`
Open coaches -> Attributes -> Create attribute. Create each only if it is missing:
- coach_type : String, size 64, Required: No, Default: private_training, Array: No
- title      : String, size 255, Required: No, Default: (leave empty), Array: No
Do not touch any other attribute in coaches. Do not edit any coach documents.

STEP 2 — Add 3 attributes to the EXISTING collection `coach_applications`
Open coach_applications -> Attributes -> Create attribute. Create each only if missing:
- application_type : String, size 32,  Required: No, Default: general, Array: No
- position         : String, size 16,  Required: No, Default: (leave empty), Array: No
- experience       : String, size 5000, Required: No, Default: (leave empty), Array: No
Do not touch any other attribute. Do not edit any application documents.
(No manual backfill is needed — the app treats a missing value as general /
private_training automatically.)

STEP 3 — Create NEW collection `players`
In database lctraining, create a collection. Collection ID and Name: players
Permissions: Read = Any ; Create = Users ; Update = Users ; Delete = Users
Add attributes (Create attribute):
- first_name    : String 64,   Required: Yes
- last_name     : String 64,   Required: Yes
- jersey_number : Integer,     Required: No
- position      : String 16,   Required: No
- age           : Integer,     Required: No
- bio           : String 5000, Required: No
- photo_url     : String 1024, Required: No
- is_active     : Boolean,     Required: No, Default: true
Wait until every attribute shows status "Available", then Indexes -> Create index:
- Key: idx_jersey_number ; Type: key ; Attribute: jersey_number ; Order: ASC

STEP 4 — Create NEW collection `team_matches`
Collection ID and Name: team_matches
Permissions: Read = Any ; Create = Users ; Update = Users ; Delete = Users
Add attributes:
- opponent   : String 255,  Required: Yes
- match_date : String 10,   Required: No
- match_time : String 16,   Required: No
- location   : String 255,  Required: No
- is_home    : Boolean,     Required: No, Default: true
- result     : String 8,    Required: No
- notes      : String 5000, Required: No
Wait until every attribute shows status "Available", then Indexes -> Create index:
- Key: idx_match_date ; Type: key ; Attribute: match_date ; Order: ASC

STEP 5 — Create NEW collection `gallery_items`
Collection ID and Name: gallery_items
Permissions: Read = Any ; Create = Users ; Update = Users ; Delete = Users
Add attributes:
- media_url  : String 1024, Required: Yes
- media_type : String 16,   Required: No, Default: image
- caption    : String 500,  Required: No
No custom index needed (sorting uses the built-in $createdAt field).

STEP 6 — Confirm storage buckets exist (do NOT create or modify anything)
In Storage, confirm these buckets exist: coach-photos, coach-resumes, site-content.
If any is missing, report it. Do not create or change any bucket.

STEP 7 — Report back
Produce a checklist. For every attribute, collection, and index listed above, state one
of: CREATED, ALREADY EXISTED (skipped), or ERROR (include the exact error message).
If any ERROR occurred or anything looked unexpected, say so clearly and stop.
```

---

## Verification (you do this in the app after the agent finishes)

1. `/admin/coaches` — shows a tab bar **All / Private Training / LCFC**, and the coach
   edit dialog has a new **Coach Type** dropdown.
2. `/admin/team` — loads with **Roster / Schedule / Gallery** tabs; each "Add" dialog
   saves without an Appwrite error.
3. `/admin/applications` — tab bar shows **All / Team Player / Team Coach / Private
   Coach / General** with counts.
4. Public pages `/team/roster`, `/team/schedule`, `/team/coaches`, `/team/gallery`
   render empty-state placeholders with no console errors.
5. The existing booking page still lists your current coaches — confirms the `coaches`
   collection was not broken.

If step 5 ever fails, that is the signal something went wrong on an existing
collection. The prompt is designed so this cannot happen, but check it anyway.

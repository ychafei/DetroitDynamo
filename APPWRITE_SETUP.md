# Appwrite Setup — Required Console Changes

The team/club expansion adds new fields and collections. Code references them, but you must create them in **Appwrite Console → Database → `lctraining`** before they'll work in production. Without these, the new admin pages will fail silently or show empty states.

> Database ID is `lctraining` (see `src/api/appwriteClient.js`).

---

## 1. New fields on the existing `coaches` collection

| Attribute | Type | Required | Default | Notes |
|---|---|---|---|---|
| `coach_type` | string (enum recommended) | no | `private_training` | Values: `private_training`, `team` |
| `title` | string (255) | no | — | Used for team coaches: "Head Coach", "Assistant", "GK Coach" |

After adding, **backfill** existing rows: set every existing coach's `coach_type` to `private_training` (so they keep showing on the booking page).

---

## 2. New field on the existing `coach_applications` collection

| Attribute | Type | Required | Default | Notes |
|---|---|---|---|---|
| `application_type` | string (enum recommended) | no | `general` | Values: `team_player`, `team_coach`, `private_training_coach`, `general` |
| `position` | string (16) | no | — | Used by team-player applications: `GK` / `DEF` / `MID` / `FWD` / `Any` |
| `experience` | string (5000) | no | — | Used by team-player and team-coach applications |

After adding, **backfill** existing rows with `application_type = 'general'`.

---

## 3. New collection: `players`

For the LCFC roster page.

**Collection ID:** `players`
**Permissions:** Any (read) · Users/Admin (create/update/delete)

| Attribute | Type | Required | Default | Notes |
|---|---|---|---|---|
| `first_name` | string (64) | yes | — | |
| `last_name` | string (64) | yes | — | |
| `jersey_number` | integer | no | — | |
| `position` | string (16) | no | — | `GK` / `DEF` / `MID` / `FWD` |
| `age` | integer | no | — | |
| `bio` | string (5000) | no | — | |
| `photo_url` | string (1024) | no | — | Returned by storage upload |
| `is_active` | boolean | no | `true` | |

Recommended index: `jersey_number` (asc).

---

## 4. New collection: `team_matches`

For the LCFC schedule page.

**Collection ID:** `team_matches`
**Permissions:** Any (read) · Users/Admin (create/update/delete)

| Attribute | Type | Required | Default | Notes |
|---|---|---|---|---|
| `opponent` | string (255) | yes | — | |
| `match_date` | string (10) | no | — | `YYYY-MM-DD` (kept as string for easy sorting) |
| `match_time` | string (16) | no | — | Free-form, e.g. `7:00 PM` |
| `location` | string (255) | no | — | |
| `is_home` | boolean | no | `true` | |
| `result` | string (8) | no | — | `W` / `L` / `D` / `TBA` |
| `notes` | string (5000) | no | — | |

Recommended index: `match_date` (asc).

---

## 5. New collection: `gallery_items`

For the LCFC gallery page.

**Collection ID:** `gallery_items`
**Permissions:** Any (read) · Users/Admin (create/update/delete)

| Attribute | Type | Required | Default | Notes |
|---|---|---|---|---|
| `media_url` | string (1024) | yes | — | URL from storage upload |
| `media_type` | string (16) | no | `image` | `image` / `video` |
| `caption` | string (500) | no | — | |

Recommended index: `$createdAt` (desc).

---

## Storage buckets (already exist — confirm)

- `coach-photos` — used for player photos too (we reuse the bucket)
- `coach-resumes` — used for all application resumes (any type)
- `site-content` — used for gallery uploads

No new buckets required.

---

## Quick verify after setup

1. Visit `/admin/coaches` — you should see a tab bar (`All / Private Training / LCFC`).
2. Edit a coach — there should be a new "Coach Type" dropdown.
3. Visit `/admin/team` — three tabs (Roster / Schedule / Gallery), each lets you Add an item.
4. Visit `/admin/applications` — tab bar shows `All / Team Player / Team Coach / Private Coach / General` with counts.
5. Public pages `/team/roster`, `/team/schedule`, `/team/coaches`, `/team/gallery` should render empty-state placeholders (no errors) until you add data.

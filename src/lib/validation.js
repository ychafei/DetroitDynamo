/**
 * Shared form-validation helpers.
 *
 * One source of truth for "is this email/phone/name well-formed" and for the
 * max character counts we accept on text fields. Before this module the rules
 * were duplicated (with three slightly different email regexes) across
 * OnboardingModal, CoachProfile and Matching, and missing entirely from the
 * application and settings forms. Keep new forms pointed here.
 *
 * Phone is US 10-digit by design: Detroit Dynamo operates in Oakland, Macomb and
 * Wayne counties, and the onboarding flow already enforced exactly this.
 */

/** Max character counts. UI maxLength + submit-time guards both read these. */
export const LIMITS = {
  name: 50,
  email: 254, // RFC 5321 max length of an email address
  phoneRaw: 10, // digits only
  shortText: 120, // quote, training area, county, position, single-line notes
  bio: 1000,
  longText: 2000, // experience, coaching background, session goals
  message: 2000,
  tag: 40, // a single specialization chip
};

/** Strip everything that isn't a digit. */
export const cleanPhone = (val) => String(val ?? '').replace(/\D/g, '');

/** US phone numbers are exactly 10 digits once punctuation is removed. */
export const isValidPhone = (val) => cleanPhone(val).length === LIMITS.phoneRaw;

/** Format a (partial) US number as (555) 123-4567 for display. */
export const formatPhone = (val) => {
  const d = cleanPhone(val).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

/** Trim + lowercase — what we should store/compare emails as. */
export const normalizeEmail = (val) => String(val ?? '').trim().toLowerCase();

/**
 * Pragmatic email check: a local part, an at-sign, a domain, a dot, a TLD, no
 * whitespace. This is the regex onboarding already used; matching it keeps
 * behaviour consistent everywhere.
 */
export const isValidEmail = (val) => {
  const v = String(val ?? '').trim();
  return v.length > 0 && v.length <= LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

/** A name has visible characters and no digits (e.g. "Jean-Luc", "O'Brien"). */
export const hasNumbers = (val) => /\d/.test(String(val ?? ''));
export const isValidName = (val) => {
  const v = String(val ?? '').trim();
  return v.length > 0 && v.length <= LIMITS.name && !hasNumbers(v);
};

/** Non-empty after trimming whitespace. */
export const isNonEmpty = (val) => String(val ?? '').trim().length > 0;

/**
 * Validate a flat form object against a spec and return
 * `{ valid, errors: { field: message } }`.
 *
 * spec example:
 *   { email: { label: 'Email', email: true, required: true },
 *     phone: { label: 'Phone', phone: true },                 // optional, only checked if filled
 *     first_name: { label: 'First name', name: true, required: true },
 *     bio: { label: 'Bio', maxLength: LIMITS.bio } }
 */
export function validateForm(values, spec) {
  const errors = {};
  for (const [field, rule] of Object.entries(spec)) {
    const raw = values?.[field];
    const str = raw == null ? '' : String(raw);
    const filled = str.trim().length > 0;
    const label = rule.label || field;

    if (rule.required && !filled) {
      errors[field] = `${label} is required.`;
      continue;
    }
    if (!filled) continue; // optional + empty → nothing else to check

    if (rule.email && !isValidEmail(str)) {
      errors[field] = `Enter a valid email address.`;
    } else if (rule.phone && !isValidPhone(str)) {
      errors[field] = `Enter a valid 10-digit phone number.`;
    } else if (rule.name && hasNumbers(str)) {
      errors[field] = `${label} can't contain numbers.`;
    } else if (rule.maxLength && str.length > rule.maxLength) {
      errors[field] = `${label} must be ${rule.maxLength} characters or fewer.`;
    } else if (rule.name && str.trim().length > (rule.maxLength || LIMITS.name)) {
      errors[field] = `${label} must be ${rule.maxLength || LIMITS.name} characters or fewer.`;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

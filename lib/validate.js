export function validateWorkoutQuery(query) {
  const errors = [];
  const parsed = {
    q: undefined,
    min: undefined,
    max: undefined,
    limit: 10
  };

  // Check for duplicate query parameters (Express parses duplicates as arrays)
  for (const key of ['q', 'min', 'max', 'limit']) {
    if (Array.isArray(query[key])) {
      errors.push(`${key} cannot be provided more than once`);
    }
  }

  // Validate q (optional search text)
  if (query.q !== undefined && !Array.isArray(query.q)) {
    parsed.q = query.q.trim().toLowerCase();
  }

  // Helper to validate whole integers
  const isWholeNumber = (str) => /^-?\d+$/.test(str.trim());

  // Validate min (optional whole number)
  if (query.min !== undefined && !Array.isArray(query.min)) {
    if (!isWholeNumber(query.min)) {
      errors.push('min must be a whole number');
    } else {
      parsed.min = Number(query.min);
    }
  }

  // Validate max (optional whole number)
  if (query.max !== undefined && !Array.isArray(query.max)) {
    if (!isWholeNumber(query.max)) {
      errors.push('max must be a whole number');
    } else {
      parsed.max = Number(query.max);
    }
  }

  // Check min <= max when both are valid numbers
  if (parsed.min !== undefined && parsed.max !== undefined && parsed.min > parsed.max) {
    errors.push('min cannot be greater than max');
  }

  // Validate limit (optional whole number, 1-50, default 10)
  if (query.limit !== undefined && !Array.isArray(query.limit)) {
    if (!isWholeNumber(query.limit)) {
      errors.push('limit must be a whole number');
    } else {
      const limitNum = Number(query.limit);
      if (limitNum < 1 || limitNum > 50) {
        errors.push('limit must be between 1 and 50');
      } else {
        parsed.limit = limitNum;
      }
    }
  }

  return { errors, parsed };
}

const ALLOWED_FIELDS = ['name', 'durationMinutes', 'muscleGroup', 'email'];
const ALLOWED_MUSCLE_GROUPS = ['push', 'pull', 'legs', 'cardio'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateWorkoutBody(body) {
  const data = body ?? {};
  const errors = [];

  // 1. Reject any unexpected fields (e.g., isAdmin=true)
  const unexpectedFields = Object.keys(data).filter(
    (key) => !ALLOWED_FIELDS.includes(key)
  );
  if (unexpectedFields.length > 0) {
    errors.push(`Unexpected field(s): ${unexpectedFields.join(', ')}`);
  }

  // Helper in case a field is sent twice as an array
  const asSingleString = (val) => (Array.isArray(val) ? undefined : val);

  // 2. Validate name (trimmed, 2–60 characters)
  const rawName = asSingleString(data.name);
  const name = typeof rawName === 'string' ? rawName.trim() : '';
  if (name.length < 2 || name.length > 60) {
    errors.push('name must be between 2 and 60 characters');
  }

  // 3. Validate durationMinutes (whole number, 5–180)
  const rawDuration = asSingleString(data.durationMinutes);
  const durationStr =
    typeof rawDuration === 'number'
      ? String(rawDuration)
      : typeof rawDuration === 'string'
        ? rawDuration.trim()
        : '';

  let durationMinutes;
  if (!/^-?\d+$/.test(durationStr)) {
    errors.push('durationMinutes must be a whole number');
  } else {
    durationMinutes = Number(durationStr);
    if (durationMinutes < 5 || durationMinutes > 180) {
      errors.push('durationMinutes must be between 5 and 180');
    }
  }

  // 4. Validate muscleGroup (case-insensitive match, stored lowercase)
  const rawMuscle = asSingleString(data.muscleGroup);
  const muscleGroup =
    typeof rawMuscle === 'string' ? rawMuscle.trim().toLowerCase() : '';
  if (!ALLOWED_MUSCLE_GROUPS.includes(muscleGroup)) {
    errors.push(
      `muscleGroup must be one of: ${ALLOWED_MUSCLE_GROUPS.join(', ')}`
    );
  }

  // 5. Validate email (basic regex, stored lowercase)
  const rawEmail = asSingleString(data.email);
  const email =
    typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  if (!EMAIL_REGEX.test(email)) {
    errors.push('email must be a valid email address');
  }

  return {
    errors,
    item: {
      name,
      durationMinutes,
      muscleGroup,
      email
    }
  };
}
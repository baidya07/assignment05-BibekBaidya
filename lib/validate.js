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
/**
 * Shared Password Policy Module
 *
 * Single source of truth for password complexity requirements across
 * candidate signup UX and server-side authentication validation.
 */

export const PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (pw) => typeof pw === "string" && pw.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least 1 uppercase letter",
    test: (pw) => typeof pw === "string" && /[A-Z]/.test(pw),
  },
  {
    id: "lowercase",
    label: "At least 1 lowercase letter",
    test: (pw) => typeof pw === "string" && /[a-z]/.test(pw),
  },
  {
    id: "number",
    label: "At least 1 number",
    test: (pw) => typeof pw === "string" && /[0-9]/.test(pw),
  },
  {
    id: "special",
    label: "At least 1 special character",
    test: (pw) => typeof pw === "string" && /[^A-Za-z0-9]/.test(pw),
  },
];

/**
 * Validates a password against all defined requirements.
 *
 * @param {string} password
 * @returns {{ isValid: boolean, failedIds: string[], error: string | null }}
 */
export function validatePassword(password) {
  if (typeof password !== "string" || !password) {
    return {
      isValid: false,
      failedIds: PASSWORD_REQUIREMENTS.map((r) => r.id),
      error:
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    };
  }

  const failedIds = [];
  for (const req of PASSWORD_REQUIREMENTS) {
    if (!req.test(password)) {
      failedIds.push(req.id);
    }
  }

  if (failedIds.length > 0) {
    return {
      isValid: false,
      failedIds,
      error:
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    };
  }

  return {
    isValid: true,
    failedIds: [],
    error: null,
  };
}

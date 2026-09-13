/**
 * Recruitment Application Status Definitions and Helpers
 * Authoritative statuses: pending, shortlisted, waitlisted, rejected
 */

export const RECRUITMENT_STATUS = {
  PENDING: "pending",
  SHORTLISTED: "shortlisted",
  WAITLISTED: "waitlisted",
  REJECTED: "rejected",
};

export const VALID_STATUSES = [
  RECRUITMENT_STATUS.PENDING,
  RECRUITMENT_STATUS.SHORTLISTED,
  RECRUITMENT_STATUS.WAITLISTED,
  RECRUITMENT_STATUS.REJECTED,
];

export const STATUS_CONFIG = {
  [RECRUITMENT_STATUS.PENDING]: {
    key: RECRUITMENT_STATUS.PENDING,
    label: "Pending",
    description: "Your application is currently under review.",
    candidateBadge: {
      text: "Under Review",
      className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40",
    },
    adminBadge: {
      text: "Pending",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800",
    },
  },
  [RECRUITMENT_STATUS.SHORTLISTED]: {
    key: RECRUITMENT_STATUS.SHORTLISTED,
    label: "Shortlisted",
    description: "You have been shortlisted for this department. Further communication will be shared soon.",
    candidateBadge: {
      text: "Shortlisted",
      className: "bg-emerald-600 text-white shadow-xs font-bold",
    },
    adminBadge: {
      text: "Shortlisted",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800",
    },
  },
  [RECRUITMENT_STATUS.WAITLISTED]: {
    key: RECRUITMENT_STATUS.WAITLISTED,
    label: "Waitlisted",
    description: "Your application is currently on the waitlist and may be reconsidered as places become available.",
    candidateBadge: {
      text: "Waitlisted",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    },
    adminBadge: {
      text: "Waitlisted",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800",
    },
  },
  [RECRUITMENT_STATUS.REJECTED]: {
    key: RECRUITMENT_STATUS.REJECTED,
    label: "Rejected",
    description: "This application was not selected for the current recruitment stage.",
    candidateBadge: {
      text: "Not Selected",
      className: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
    },
    adminBadge: {
      text: "Rejected",
      className: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800",
    },
  },
};

/**
 * Normalizes applicant data into one authoritative status string.
 * Handles legacy applications that lack a status field.
 */
export function normalizeStatus(applicantOrStatus) {
  if (!applicantOrStatus) return RECRUITMENT_STATUS.PENDING;

  // If already a status string
  if (typeof applicantOrStatus === "string") {
    const s = applicantOrStatus.toLowerCase().trim();
    if (VALID_STATUSES.includes(s)) return s;
    if (s === "true") return RECRUITMENT_STATUS.SHORTLISTED;
    if (s === "false") return RECRUITMENT_STATUS.PENDING;
    return RECRUITMENT_STATUS.PENDING;
  }

  // If applicant object
  const rawStatus = typeof applicantOrStatus.status === "string" ? applicantOrStatus.status.toLowerCase().trim() : "";
  if (VALID_STATUSES.includes(rawStatus)) {
    return rawStatus;
  }

  // Legacy fallback: if shortlisted boolean is explicitly true
  if (applicantOrStatus.shortlisted === true || applicantOrStatus.shortlisted === "true") {
    return RECRUITMENT_STATUS.SHORTLISTED;
  }

  // Default to pending for any unreviewed or legacy documents
  return RECRUITMENT_STATUS.PENDING;
}

/**
 * Returns formatted human-readable label: Pending, Shortlisted, Waitlisted, Rejected
 */
export function getStatusLabel(applicantOrStatus) {
  const status = normalizeStatus(applicantOrStatus);
  return STATUS_CONFIG[status]?.label || "Pending";
}

/**
 * Returns user-facing explanation message for candidate dashboard
 */
export function getStatusDescription(applicantOrStatus) {
  const status = normalizeStatus(applicantOrStatus);
  return STATUS_CONFIG[status]?.description || STATUS_CONFIG[RECRUITMENT_STATUS.PENDING].description;
}

// Auth server configuration
export const PORT = 4000;

// Shared secret between Auth Server and FHIR Server (must match).
export const JWT_SECRET = "poc-secret-change-me";

// Authorization codes live for 60 seconds, single-use.
export const CODE_TTL_MS = 60_000;

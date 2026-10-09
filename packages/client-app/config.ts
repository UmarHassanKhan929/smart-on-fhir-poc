// Client app configuration
export const PORT = 5000;

// Server-side base URLs. Defaults match local dev; in Docker compose these
// point at the service names (http://fhir:3000, http://auth:4000).
// The BROWSER-facing URLs (authorize redirect, redirect_uri) stay
// localhost-based — those are advertised by the FHIR server's discovery doc.
export const FHIR_BASE_URL = process.env.FHIR_BASE_URL ?? "http://localhost:3000";
export const AUTH_BASE_URL = process.env.AUTH_BASE_URL ?? "http://localhost:4000";

// Client registration — must match what the Auth Server knows about us.
export const CLIENT = {
  id: "my-health-app",
  secret: "super-secret",
  redirectUri: "http://localhost:5000/callback",
  scopes: "patient/Patient.read patient/Observation.read", // least privilege
};

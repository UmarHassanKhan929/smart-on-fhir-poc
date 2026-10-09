import { AUTH_BASE_URL, CLIENT, FHIR_BASE_URL } from "../config";

// Fetch the SMART configuration the FHIR server advertises.
export async function discoverSmartConfiguration(): Promise<any> {
  const res = await fetch(`${FHIR_BASE_URL}/.well-known/smart-configuration`);
  return res.json();
}

// Exchange an authorization code for tokens at the auth server's token
// endpoint (AUTH_BASE_URL — service name inside Docker).
export async function exchangeCodeForToken(code: string): Promise<any> {
  const conf = await discoverSmartConfiguration();
  const res = await fetch(`${AUTH_BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: CLIENT.id,
      client_secret: CLIENT.secret,
      redirect_uri: CLIENT.redirectUri,
    }),
  });
  return res.json();
}

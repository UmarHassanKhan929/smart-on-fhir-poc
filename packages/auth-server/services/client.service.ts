export interface RegisteredClient {
  clientId: string;
  redirectUri: string;
  secret: string;
}

// Registered apps: client_id and exact redirect URIs.
const registeredClients = new Map<string, RegisteredClient>([
  ["my-health-app", {
    clientId: "my-health-app",
    redirectUri: "http://localhost:5000/callback",
    secret: "super-secret",
  }],
]);

export function findClient(clientId: string): RegisteredClient | undefined {
  return registeredClients.get(clientId);
}

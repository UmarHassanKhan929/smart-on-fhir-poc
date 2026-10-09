export interface User {
  id: string;
  password: string;
  patientId: string;
}

// User directory: each user maps to the patient record they own.
// This binding is decided here, never by the client app.
const users = new Map<string, User>([
  ["bacha", { id: "user-1", password: "pass1", patientId: "001" }],
  ["umar",  { id: "user-2", password: "pass2", patientId: "002" }],
]);

export function verifyCredentials(username: string, password: string): User | undefined {
  const user = users.get(username);
  return user && user.password === password ? user : undefined;
}

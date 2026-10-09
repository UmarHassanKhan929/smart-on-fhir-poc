import crypto from "crypto";
import { CODE_TTL_MS } from "../config";

export interface AuthCode {
  clientId: string;
  userId: string;
  patientId: string;
  scope: string;
  exp: number;
}

// Authorization codes: short-lived (60 s), single-use.
const authCodes = new Map<string, AuthCode>();

// Mint a one-time code, bound to the authenticated user's patient record.
export function mintCode(claims: {
  clientId: string; userId: string; patientId: string; scope: string;
}): string {
  const code = crypto.randomBytes(16).toString("hex");
  authCodes.set(code, { ...claims, exp: Date.now() + CODE_TTL_MS });
  return code;
}

// Validate a code for exchange: must exist, be unexpired, and belong
// to the client presenting it. (Does NOT consume it — that happens
// only after the client secret is verified.)
export function validateCode(code: unknown, clientId: unknown): AuthCode | undefined {
  const payload = authCodes.get(String(code));
  if (!payload || payload.exp < Date.now() || payload.clientId !== clientId) {
    return undefined;
  }
  return payload;
}

// Single use — a replayed code fails here.
export function consumeCode(code: unknown): void {
  authCodes.delete(String(code));
}

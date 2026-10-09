import type { Request, Response } from "express";
import { AUTH_BASE_URL, SCOPES } from "../config";

// SMART discovery: the app reads this FIRST
export function getSmartConfiguration(_req: Request, res: Response) {
  res.json({
    authorization_endpoint: `${AUTH_BASE_URL}/authorize`,
    token_endpoint: `${AUTH_BASE_URL}/token`,
    scopes_supported: [
      "openid", "profile",
      SCOPES.patientRead,
      SCOPES.observationRead,
    ],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
  });
}

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

// Access token claims: the launch context every FHIR call is constrained by.
export interface AccessTokenClaims {
  sub: string;
  patient: string;
  scope: string;
}

export function signAccessToken(claims: AccessTokenClaims): string {
  return jwt.sign(claims, JWT_SECRET, { expiresIn: "1h" });
}

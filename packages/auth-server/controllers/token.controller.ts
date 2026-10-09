import type { Request, Response } from "express";
import * as clientService from "../services/client.service";
import * as codeService from "../services/authorizationCode.service";
import * as tokenService from "../services/token.service";

// POST /token — exchange the code for a signed access token.
export function handleToken(req: Request, res: Response) {
  const { grant_type, code, client_id, client_secret } = req.body;
  if (grant_type !== "authorization_code") {
    return res.status(400).json({ error: "unsupported_grant_type" });
  }

  const payload = codeService.validateCode(code, client_id);
  if (!payload) return res.status(400).json({ error: "invalid_grant" });

  const client = clientService.findClient(client_id);
  if (!client || client.secret !== client_secret) {
    return res.status(401).json({ error: "invalid_client" });
  }
  codeService.consumeCode(code);

  res.json({
    access_token: tokenService.signAccessToken({
      sub: payload.userId,
      patient: payload.patientId,
      scope: payload.scope,
    }),
    token_type: "Bearer",
    expires_in: 3600,
    scope: payload.scope,
    patient: payload.patientId, // launch context
  });
}

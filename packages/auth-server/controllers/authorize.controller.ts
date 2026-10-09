import type { Request, Response } from "express";
import * as clientService from "../services/client.service";
import * as userService from "../services/user.service";
import * as codeService from "../services/authorizationCode.service";

// GET /authorize — validate the app's request, render the login form.
export function showAuthorizeForm(req: Request, res: Response) {
  const { response_type, client_id, redirect_uri, scope, state } = req.query;
  const client = clientService.findClient(String(client_id));

  if (!client) return res.status(400).send("Unknown client");
  if (response_type !== "code") return res.status(400).send("Only 'code' supported");
  if (client.redirectUri !== redirect_uri) return res.status(400).send("Bad redirect_uri");

  res.render("authorize", {
    clientId: client.clientId,
    scope,
    state,
    redirectUri: redirect_uri,
  });
}

// POST /authorize/decision — authenticate the user, mint a one-time code.
export function handleAuthorizeDecision(req: Request, res: Response) {
  const { username, password, scope, state, client_id, redirect_uri } = req.body;
  const user = userService.verifyCredentials(username, password);
  if (!user) return res.status(401).send("Bad credentials");

  const code = codeService.mintCode({
    clientId: client_id,
    userId: user.id,
    patientId: user.patientId,
    scope,
  });

  // Standard OAuth response: redirect back with ?code=...&state=...
  res.redirect(`${redirect_uri}?code=${code}&state=${state ?? ""}`);
}

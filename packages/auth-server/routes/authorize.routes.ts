import { Router } from "express";
import { showAuthorizeForm, handleAuthorizeDecision } from "../controllers/authorize.controller";

export const authorizeRouter: Router = Router();

authorizeRouter.get("/authorize", showAuthorizeForm);
authorizeRouter.post("/authorize/decision", handleAuthorizeDecision);

import { Router } from "express";
import { handleToken } from "../controllers/token.controller";

export const tokenRouter: Router = Router();

tokenRouter.post("/token", handleToken);

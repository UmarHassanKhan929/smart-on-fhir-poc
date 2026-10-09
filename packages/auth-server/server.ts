import path from "path";
import express from "express";
import { PORT } from "./config";
import { authorizeRouter } from "./routes/authorize.routes";
import { tokenRouter } from "./routes/token.routes";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(authorizeRouter);
app.use(tokenRouter);

app.listen(PORT, () => console.log("🔐 Auth server on http://localhost:4000"));

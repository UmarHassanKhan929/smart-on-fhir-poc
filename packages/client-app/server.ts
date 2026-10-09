import path from "path";
import express from "express";
import { PORT } from "./config";
import { homeRouter } from "./routes/home.routes";
import { smartRouter } from "./routes/smart.routes";

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(homeRouter);
app.use(smartRouter);

app.listen(PORT, () => console.log("💗 Client app on http://localhost:5000"));

import { Hono } from "hono";
import { v1 } from "./routes/routes";

const app = new Hono();

app.route("/api/v1", v1);

export default app;

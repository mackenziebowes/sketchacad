import { Hono } from "hono";
import { auth as AMW, type AuthEnv } from "~/library/middleware/auth";
import user from "./user";
// import auth from "./auth";

const app = new Hono();

app.route("/user", user);
app.use(AMW);

export default app;

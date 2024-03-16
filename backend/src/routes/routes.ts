import { Hono } from "hono";
import { userRoute } from "./userRoute";
import { blogRoute } from "./blogRoute";
import { ENV } from "./common";

export const v1 = new Hono<{
  Bindings: ENV;
}>();

v1.route("/v1/user", userRoute);
v1.route("v1/blog", blogRoute);

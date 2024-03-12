import { Hono } from "hono";
import { RegExpRouter } from "hono/router/reg-exp-router";

export const v1 = new Hono({ router: new RegExpRouter() });

v1.post("/signup", (c) => {
  return c.text("test");
});
v1.post("/signin", (c) => {
  return c.text("test");
});
v1.post("/blog", (c) => {
  return c.text("test");
});
v1.put("/blog", (c) => {
  return c.text("test");
});
v1.get("/blog/:blogId", (c) => {
  return c.text("test");
});

import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, jwt, sign } from "hono/jwt";
import { ENV } from "./common";

export const userRoute = new Hono<{
  Bindings: ENV;
}>();

userRoute.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const res = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    const token = await sign({ id: res.id }, c.env.JWT_SECRET);

    return c.json({
      token,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "User exists!",
    });
  }
});

userRoute.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({
      message: "User does't exists",
    });
  }

  const token = await sign({ id: user.id }, c.env.JWT_SECRET);

  return c.json({
    token,
  });
});

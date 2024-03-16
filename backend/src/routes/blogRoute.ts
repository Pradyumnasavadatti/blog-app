import { Hono } from "hono";
import { ENV, VARS } from "./common";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRoute = new Hono<{
  Bindings: ENV;
  Variables: VARS;
}>();

blogRoute.use("/*", async (c, next) => {
  try {
    const header = c.req.header("auth") || "";
    const token = header.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("userId", payload.id);
    await next();
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Unauthorized access!",
    });
  }
});

blogRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: c.get("userId"),
      },
    });

    return c.json({
      blogId: blog.id,
      message: "BooM!! posted",
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Something went wrong!",
    });
  }
});

blogRoute.put("/", async (c) => {
  try {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      message: "Updated!!",
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Something went wrong!",
    });
  }
});

blogRoute.get("/bulk", async (c) => {
  try {
    const params = c.req.query("skip");
    console.log(params);
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const data = await prisma.post.findMany({
      skip: Number(params),
      take: 2,
    });

    return c.json({
      data,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Something went wrong!",
    });
  }
});

blogRoute.get("/:blogId", async (c) => {
  try {
    const data = c.req.param().blogId;
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.findUnique({
      where: {
        id: data,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json({
      post,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Something went wrong!",
    });
  }
});

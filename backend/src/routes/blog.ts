import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { blogPostBody, blogPutBody } from "@medium-blog/common";

export const blogRoute = new Hono<{
   Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
   };
   Variables: {
      userId: string;
   };
}>();

blogRoute.use("/*", async (c, next) => {
   try {
      const authHeader = c.req.header("Authorization") || "";
      const user = await verify(authHeader, c.env.JWT_SECRET);
      if (user) {
         c.set("userId", user.id);
         await next();
      } else {
         c.status(401);
         return c.json({
            message: "you are not logged in",
         });
      }
   } catch (e) {
      c.status(401);
      return c.json({
         message: "you are not logged in",
      });
   }
});

blogRoute.post("/", async (c) => {
   const body = await c.req.json();
   const { success } = blogPostBody.safeParse(body);
   if (!success) {
      c.status(411);
      return c.text("Invalid input");
   }
   const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
   }).$extends(withAccelerate());

   const authorId = c.get("userId");

   const blog = await prisma.blog.create({
      data: {
         title: body.title,
         content: body.content,
         authorId: authorId,
      },
   });

   return c.json({
      id: blog.id,
   });
});

blogRoute.put("/", async (c) => {
   const body = await c.req.json();
   const { success } = blogPutBody.safeParse(body);
   if (!success) {
      c.status(411);
      return c.text("Invalid input");
   }
   const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
   }).$extends(withAccelerate());

   const blog = await prisma.blog.update({
      where: {
         id: body.id,
      },
      data: {
         title: body.title,
         content: body.content,
      },
   });

   return c.json({
      blog,
   });
});

blogRoute.get("/bulk", async (c) => {
   const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
   }).$extends(withAccelerate());

   const blogs = await prisma.blog.findMany({
      select: {
         content: true,
         title: true,
         id: true,
         author: {
            select: {
               name: true,
            },
         },
      },
   });

   return c.json({
      blogs,
   });
});

blogRoute.get("/:id", async (c) => {
   const id = c.req.param("id");
   const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
   }).$extends(withAccelerate());

   const blog = await prisma.blog.findFirst({
      where: {
         id: id,
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
      blog,
   });
});

import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { userSiginBody, userSignupBody } from "@medium-blog/common";
export const userRoute = new Hono<{
   Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
   };
}>();

userRoute.post("/signup", async (c) => {
   const body = await c.req.json();
   const { success } = userSignupBody.safeParse(body);
   if (!success) {
      c.status(411);
      return c.text("Invalid input");
   }
   const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
   }).$extends(withAccelerate());

   try {
      const user = await prisma.user.create({
         data: {
            email: body.email,
            password: body.password,
            name: body.name,
         },
      });

      const jwt = await sign(
         {
            id: user.id,
         },
         c.env.JWT_SECRET
      );
      return c.text(jwt);
   } catch (e) {
      console.log(e);
      c.status(411);
      return c.text("User already exist with this email");
   }
});

userRoute.post("/signin", async (c) => {
   const body = await c.req.json();
   const { success } = userSiginBody.safeParse(body);

   if (!success) {
      c.status(411);
      return c.text("Invalid input");
   }
   const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
   }).$extends(withAccelerate());

   const user = await prisma.user.findUnique({
      where: {
         email: body.email,
         password: body.password,
      },
   });

   if (!user) {
      c.status(403);
      return c.text("Invalid credentials");
   }

   const jwt = await sign(
      {
         id: user.id,
      },
      c.env.JWT_SECRET
   );

   return c.json({
      message: "login successful",
      token: jwt,
   });
});

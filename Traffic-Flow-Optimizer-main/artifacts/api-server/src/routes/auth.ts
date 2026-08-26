import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { count, eq } from "drizzle-orm";
import { hashPassword, signSession, verifyPassword } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const [{ total }] = await db.select({ total: count() }).from(usersTable);
  if (total === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await db.insert(usersTable).values({ email: process.env.ADMIN_EMAIL.toLowerCase(), passwordHash: hashPassword(process.env.ADMIN_PASSWORD), role: "admin" });
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  res.json({ token: signSession(user), user: { email: user.email, role: user.role } });
});

export default router;

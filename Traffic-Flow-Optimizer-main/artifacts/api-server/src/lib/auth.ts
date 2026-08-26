import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";

type Session = { sub: number; role: "admin" | "operator"; exp: number };
const secret = () => process.env.AUTH_SECRET ?? "development-only-change-me";
const encode = (value: string) => Buffer.from(value).toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString();

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const candidate = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}
export function signSession(user: { id: number; role: "admin" | "operator" }): string {
  const payload = encode(JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 8 * 60 * 60 * 1000 }));
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
function readSession(token?: string): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  if (!signature || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const session = JSON.parse(decode(payload)) as Session;
  return session.exp > Date.now() ? session : null;
}
export const requireRole = (...roles: Session["role"][]): RequestHandler => (req, res, next) => {
  const session = readSession(req.header("authorization")?.replace(/^Bearer\s+/i, ""));
  if (!session || !roles.includes(session.role)) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
};

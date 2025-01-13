import { createCookie } from "@remix-run/node";

export const sessionCookie = createCookie("api_key", {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 1 semana
});

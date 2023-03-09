import type { User } from "@prisma/client";
import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import env from "~/env.server";
import { prisma } from "./prisma.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

const USER_SESSION_KEY = "userId";
const NONCE_KEY = "nonce";

export async function getSession(request: Request) {
  const cookie = request.headers.get("cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(request: Request): Promise<User | null> {
  const userId = await getUserId(request);
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (user) return user;

  throw await logout(request);
}

export async function requireUser(request: Request): Promise<User> {
  const user = await getUser(request);
  if (user) return user;

  throw await logout(request);
}

/**
 * Returns the nonce from the session if it exists.
 * @param request - Request object
 * @returns - A nonce string
 */
export async function getNonce(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  const nonce = session.get(NONCE_KEY);
  return nonce;
}

export async function createUserSession({ request, userId }: { request: Request; userId: string }) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);

  return json(userId, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function createNonceSession({ request, nonce }: { request: Request; nonce: string }) {
  const session = await getSession(request);
  session.set(NONCE_KEY, nonce);

  return json(nonce, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/app", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

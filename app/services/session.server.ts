import type { User } from "@prisma/client";
import { createCookieSessionStorage, json } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

const USER_SESSION_KEY = "userId";
const NONCE = "nonce";

export async function getSession(request: Request) {
  const cookie = request.headers.get("cookie");
  return await sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<User | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  console.log("SESSION", session, userId);
  return userId;
}

export async function getNonce(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  const nonce = session.get(NONCE);
  return nonce;
}

export async function createUserSession({ request, userId }: { request: Request; userId: string }) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);

  throw json(
    { userId },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
}

export async function createNonceSession({ request, nonce }: { request: Request; nonce: string }) {
  const session = await getSession(request);
  session.set(NONCE, nonce);

  throw json(
    { nonce },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return json(null, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

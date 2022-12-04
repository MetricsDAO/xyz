import type { User } from "@prisma/client";
import { createCookieSessionStorage, json } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("cookie");
  return await sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<User | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function createUserSession({ request, userId }: { request: Request; userId: string }) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);

  throw json(
    { status: "success" },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  };
}

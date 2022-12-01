import { redirect } from "@remix-run/node";
import { getSession } from "~/services/session.server";

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

import type { ActionArgs } from "@remix-run/node";

import { logout } from "~/services/session.server";

export async function action({ request }: ActionArgs) {
  return logout(request);
}

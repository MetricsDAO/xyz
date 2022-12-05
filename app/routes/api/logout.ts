import type { DataFunctionArgs } from "@remix-run/node";
import { logout } from "~/services/session.server";

export async function loader({ request }: DataFunctionArgs) {
  console.log("log out");
  return await logout(request);
}

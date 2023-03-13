import { redirect } from "@remix-run/node";

export const loader = async () => {
  return redirect("/app/analyze");
};

export default function Index() {
  return <></>;
}

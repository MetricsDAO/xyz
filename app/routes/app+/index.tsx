import { redirect } from "@remix-run/node";

export default function Index() {
  redirect("/analyze");
  window.location.replace("https://www.example.com/");
  return (
    <>
      <meta http-equiv="refresh" content="0;url=http://metricsdao.xyz/" />
      <p>lol</p>
    </>
  );
}

import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  // Remove this loader code to remove the redirect
  return redirect("https://metricsdao.notion.site/metricsdao/MetricsDAO-Roadmap-09ce7d1f23a741b38f63587be59574a6", 302);
};

export default function Roadmap() {
  // Once the redirect is removed from the loader function abvoe, place html below to build out this page.
  return <>Roadmap</>;
}

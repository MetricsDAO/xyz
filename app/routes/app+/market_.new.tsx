// import type { DataFunctionArgs } from "@remix-run/node";
// import { typedjson, useTypedLoaderData } from "remix-typedjson";
// import { listProjects } from "~/services/projects.server";
// import { listTokens } from "~/services/tokens.server";
// import { fakeLaborMarketFormValues, NewMarket } from "~/features/markets/new-market";
// import { requireUser } from "~/services/session.server";

// export const loader = async ({ request, params }: DataFunctionArgs) => {
//   const url = new URL(request.url);
//   await requireUser(request, `/app/login?redirectto=app/market/new`);

//   const projects = await listProjects();
//   const tokens = await listTokens();
//   const defaultValues = url.searchParams.get("fake") ? fakeLaborMarketFormValues() : {};
//   return typedjson({ projects, tokens, defaultValues });
// };

// export default function NewMarketRoute() {
//   const { projects, defaultValues, tokens } = useTypedLoaderData<typeof loader>();
//   return <NewMarket defaultValues={defaultValues} projects={projects} tokens={tokens} />;
// }

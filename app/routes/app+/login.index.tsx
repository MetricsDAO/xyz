import type { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { Container } from "~/components/container";
import CustomConnectButton from "~/features/connect-button";
import { connectToDatabase } from "~/services/mongo.server";
import { getUser } from "~/services/session.server";
import { pineConfig } from "~/utils/pine-config.server";

const paramSchema = z.object({ redirectto: z.string() });
export const loader = async ({ request, params }: DataFunctionArgs) => {
  const client = await connectToDatabase();
  const pine = pineConfig();
  const db = client.db(`${pine.namespace}-${pine.subscriber}`);
  const url = new URL(request.url);

  const { redirectto } = getParamsOrFail(url.searchParams, paramSchema);
  const user = await getUser(request);
  if (user) {
    return redirect(`/${redirectto}`);
  }
  return typedjson({});
};

export default function LoginPage() {
  return (
    <Container className="py-24 px-10">
      <div className="flex flex-col h-full items-center justify-center z-50">
        <div className="flex flex-col gap-4 items-center justify-center">
          <p>Please Sign in to view this page.</p>
          <CustomConnectButton />
        </div>
      </div>
    </Container>
  );
}

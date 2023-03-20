import type { DataFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Container } from "~/components";
import { EvmAddressSchema } from "~/domain/address";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import SubmissionCreator from "~/features/submission-creator/submission-creator";
import { requireUser } from "~/services/session.server";

const paramsSchema = z.object({ address: EvmAddressSchema, requestId: z.string() });

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address, requestId } = paramsSchema.parse(params);
  const user = await requireUser(request, "app/login?redirectto=/app/rewards");

  const laborMarket = await getIndexedLaborMarket(address);
  invariant(laborMarket, "labormarket must exist");

  return typedjson({ laborMarket, requestId }, { status: 200 });
};

export default function SubmitQuestion() {
  const { laborMarket, requestId } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16 mx-auto`">
      <div className="flex flex-col-reverse justify-center lg:flex-row  space-y-reverse space-y-8 lg:space-y-0 lg:space-x-16">
        <main className="lg:max-w-xl space-y-7">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold">Submit Your Work</h1>
            <h2 className="text-lg text-cyan-500">Provide a public link to your work.</h2>
            <p className="text-gray-500 text-sm">
              Submit your work. Peers will review and score your submission. If you’re a winner, you’ll earn tokens and
              rMETRIC from the challenge reward pool!
            </p>
          </div>
          <SubmissionCreator laborMarketAddress={laborMarket.address} serviceRequestId={requestId} />
        </main>
        <aside className="lg:basis-1/3 ">
          <div className="rounded-lg border-2 p-5 bg-blue-300 bg-opacity-5 space-y-6 text-sm">
            <div className="space-y-1">
              <p className="font-bold">Analyst tools and resources:</p>
              <a
                href="https://docs.metricsdao.xyz/analyst-resources/resources"
                target="_blank"
                rel="noreferrer"
                className="block text-blue-500"
              >
                MetricsDAO Docs
              </a>
              <a href="https://blog.metricsdao.xyz/" target="_blank" rel="noreferrer" className="block text-blue-500">
                MetricsDAO Blog
              </a>
            </div>
            <div className="space-y-1">
              <p className="font-bold">How to make stuff that lasts:</p>
              <a
                href="https://blog.metricsdao.xyz/make-stuff-that-lasts/"
                target="_blank"
                rel="noreferrer"
                className="block text-blue-500"
              >
                Make Stuff That Lasts
              </a>
            </div>
            <div className="space-y-1">
              <p className="font-bold">Examples of best submissions:</p>
              <a
                href="https://blog.metricsdao.xyz/tag/best-submissions/"
                target="_blank"
                rel="noreferrer"
                className="block text-blue-500"
              >
                Best Submissions
              </a>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

import type { DataFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Container } from "~/components";
import { EvmAddressSchema } from "~/domain/address";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import SubmissionCreator from "~/features/submission-creator/submission-creator";

const paramsSchema = z.object({ address: EvmAddressSchema, requestId: z.string() });

export const loader = async ({ params }: DataFunctionArgs) => {
  const { address, requestId } = paramsSchema.parse(params);
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
            <h1 className="text-3xl font-semibold">Submit Your Idea</h1>
            <h2 className="text-lg text-cyan-500">What would you like Web3 analysts to address?</h2>
            <p className="text-gray-500 text-sm">
              Submit your idea. Peer reviewers will score your submission. If you’re a winner, you’ll earn tokens and
              rMETRIC from the challenge reward pool!
            </p>
          </div>
          <SubmissionCreator laborMarketAddress={laborMarket.address} serviceRequestId={requestId} />
        </main>
        <aside className="lg:basis-1/3 ">
          <div className="rounded-lg border-2 p-5 bg-blue-300 bg-opacity-5 space-y-6 text-sm">
            <p className="font-bold">Be specific:</p>
            <div className="text-gray-500 space-y-3">
              <p>"How many people actively use Sushi?"</p>
              <p>
                The original question has many interpretations: SUSHI the token? SUSHI the dex? What is a person? Are we
                talking Ethereum? What about Polygon?
              </p>
              <p className="font-medium italic">
                UPDATE: How many addresses actively use the SUSHI token on Ethereum?{" "}
              </p>
            </div>
            <p className="font-bold">Define metrics:</p>
            <div className="text-gray-500 space-y-3">
              <p>
                What is “active“? What is “use”? These terms can (and will) mean different things to different people.
                It doesn't matter what definition you use as long as you communicate your expectations. Alternatively,
                you can ask for the metric to be defined as part of the question.
              </p>
              <p className="font-medium italic">UPDATE: How many addresses have transferred SUSHI on Ethereum?</p>
            </div>
            <div className="space-y-3">
              <p className="font-bold">Specify time boundaries:</p>
              <div className="text-gray-500 space-y-3">
                <p>
                  We still haven't fully defined “active”. Specifying time makes the result easier to understand, don't
                  rely on the person answering the question to specify time for you if you didn’t ask them to.
                </p>
                <p className="font-medium italic">
                  UPDATE: How many addresses have transferred SUSHI on Ethereum in the last 90 days?
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

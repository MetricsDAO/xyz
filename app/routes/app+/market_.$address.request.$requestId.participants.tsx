import type { DataFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { Card, Checkbox, Label, UserBadge } from "~/components";
import { findParticipants } from "~/domain/user-activity/function.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { fromNow } from "~/utils/date";
import { EvmAddressSchema } from "~/domain/address";
import { z } from "zod";
import { ValidatedForm } from "remix-validated-form";
import { useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ParticipantSearchSchema } from "~/domain";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import { connectToDatabase } from "~/services/mongo.server";

const paramsSchema = z.object({ address: EvmAddressSchema, requestId: z.string() });
const validator = withZod(ParticipantSearchSchema);

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address, requestId } = paramsSchema.parse(params);
  invariant(address, "serviceRequestId is required");
  invariant(requestId, "laborMarketAddress is required");
  await connectToDatabase();

  const url = new URL(request.url);
  const search = getParamsOrFail(url.searchParams, ParticipantSearchSchema);
  const participations = await findParticipants({
    params: search,
    requestId: requestId,
    laborMarketAddress: address ?? "",
  });
  return typedjson({ participations });
};

export default function ServiceIdParticipants() {
  const { participations } = useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

  return (
    <section className="space-y-7">
      <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
        <main className="w-full border-spacing-4 border-separate space-y-4">
          {participations.map((p) => {
            return (
              <Card asChild className="px-6 py-4" key={`${p._id}`}>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <UserBadge address={p.userAddress as `0x${string}`} />
                    <p className="text-sm">{translateEventType(p.eventType.eventType)}</p>
                  </div>
                  <p className="text-sm text-gray-500">{fromNow(p.blockTimestamp)}</p>
                </div>
              </Card>
            );
          })}
        </main>
        <aside className="md:w-1/4">
          <ValidatedForm
            formRef={formRef}
            method="get"
            validator={validator}
            onChange={handleChange}
            className="space-y-3 border-[1px] border-solid border-[#EDEDED] bg-blue-300 bg-opacity-5 rounded-lg p-4"
          >
            <Label>Filter:</Label>
            <Checkbox
              onChange={handleChange}
              id="request_signal_checkbox"
              name="eventType"
              value="RequestSignal"
              label="Claimed To Submit"
            />
            <Checkbox
              onChange={handleChange}
              id="request_fulfilled_checkbox"
              name="eventType"
              value="RequestFulfilled"
              label="Submitted"
            />
            <Checkbox
              onChange={handleChange}
              id="review_signal_checkbox"
              name="eventType"
              value="ReviewSignal"
              label="Claimed To Review"
            />
            <Checkbox
              onChange={handleChange}
              id="request_reviewed_checkbox"
              name="eventType"
              value="RequestReviewed"
              label="Reviewed"
            />
          </ValidatedForm>
        </aside>
      </div>
    </section>
  );
}

function translateEventType(eventType: string) {
  switch (eventType) {
    case "RequestReviewed": {
      return "reviewed";
    }
    case "RequestSignal": {
      return "claimed to submit";
    }
    case "ReviewSignal": {
      return "claimed to review";
    }
    case "RequestFulfilled": {
      return "submitted";
    }
    default: {
      return "";
    }
  }
}

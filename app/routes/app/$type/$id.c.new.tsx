import { faker } from "@faker-js/faker";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import dayjs from "dayjs";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Container } from "~/components";
import { Button } from "~/components/button";
import { ValidatedInput } from "~/components/input/input";
import { ValidatedSelect } from "~/components/select";
import { ValidatedTextarea } from "~/components/textarea/textarea";
import { fakeChallengeNew } from "~/domain";
import { useSubmitRequest } from "~/hooks/use-submit-request";

const inputDateSchema = z.string().refine((d) => {
  const date = dayjs(d).toDate();
  try {
    z.date().parse(date);
    return true;
  } catch (e) {
    console.error(e);
  }
  return false;
});

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const defaultValues = url.searchParams.get("fake") ? fakeChallengeNew() : undefined;
  return typedjson({ defaultValues });
};

export default function CreateChallenge() {
  const { defaultValues } = useTypedLoaderData<typeof loader>();
  const challengeData = useMemo(() => {
    return {
      laborMarketAddress: "0xf48cdadfa609f0348d9e5c14f2801be0a45e0a33", // recently created labor market on Goerli https://goerli.etherscan.io/address/0xf48cdadfa609f0348d9e5c14f2801be0a45e0a33
      pTokenAddress: "0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc", // FAU token https://erc20faucet.com/
      pTokenQuantity: 0, //TODO
      pTokenId: 0, // TODO
      title: "Babies first Challenge",
      description: "We all start somewhere",
      uri: "ipfs-uri",
      enforcementExpiration: faker.date.future(),
      submissionExpiration: faker.date.future(),
      signalExpiration: faker.date.future(),
    };
  }, []);

  const { write } = useSubmitRequest({
    data: challengeData,
    onTransactionSuccess() {
      toast.dismiss("creating-challenge");
      toast.success("Challenge created!");
    },
    onWriteSuccess() {
      toast.loading("Creating challenge...", { id: "creating-challenge" });
    },
  });

  // const x = useFormContext("myform");

  // console.log("fieldErrors", x);

  // for (let [key, value] of x.getValues()) {
  //   console.log(key, value, typeof value);
  // }

  return (
    <Container className="max-w-3xl mt-10 space-y-10">
      <div className="space-y-3">
        <h1 className="font-semibold text-3xl">Launch Challenge</h1>
        <p className="text-lg text-cyan-500">
          Reward peers to crowdsource the best questions for blockchain analysts to answer about any web3 topic
        </p>
        <p>
          Crowdsource the best questions for crypto analysts to answer about an important or timely challenge. Create
          and incentivize a question brainstorm for any web3 challenge to get started.
        </p>
      </div>

      <ValidatedForm
        id="myform"
        defaultValues={{
          ...defaultValues,
          language: "english",
          projects: "ethereum",
          startDate: dayjs().format("YYYY-MM-DD"),
          startTime: dayjs().format("HH:mm"),
          endDate: dayjs().format("YYYY-MM-DD"),
          endTime: dayjs().format("HH:mm"),
          reviewEndDate: dayjs().format("YYYY-MM-DD"),
          reviewEndTime: dayjs().format("HH:mm"),
          rewardToken: "ETH",
          rewardPool: "5",
        }}
        validator={withZod(
          z.object({
            title: z.string(),
            description: z.string(),
            language: z.enum(["english", "spanish"]),
            projects: z.enum(["ethereum", "solana"]),
            startDate: inputDateSchema,
            startTime: z.string(),
            endDate: inputDateSchema,
            endTime: z.string(),
            reviewEndDate: inputDateSchema,
            reviewEndTime: z.string(),
            rewardToken: z.enum(["ETH"]),
            rewardPool: z.string(),
          })
        )}
        onSubmit={(data) => {
          console.log("data", data);
        }}
        className="space-y-10"
      >
        <section className="space-y-3">
          <h2 className="font-bold">Challenge Title</h2>
          <ValidatedInput name="title" placeholder="Challenge Title" className="w-full" />
        </section>
        <section className="space-y-3">
          <h2 className="font-bold">What do you want to source questions about?</h2>
          <ValidatedTextarea
            name="description"
            placeholder="Crowdsource the best questions for blockchain analysts to answer about any web3 topic."
          />
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow">
              <ValidatedSelect
                name="language"
                placeholder="Language"
                options={[
                  { label: "English", value: "english" },
                  { label: "Spanish", value: "spanish" },
                ]}
              />
            </div>
            <div className="flex-grow">
              <ValidatedSelect
                name="projects"
                placeholder="Blockchain/Project(s)"
                options={[
                  { label: "Ethereum", value: "ethereum" },
                  { label: "Solana", value: "solana" },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold">When will submissions be accepted</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow">
              <p>Start</p>
              <ValidatedInput type="date" name="startDate" placeholder="Start date" />
              <ValidatedInput type="time" name="startTime" placeholder="Start time" />
            </div>
            <div className="flex-grow">
              <p>End</p>
              <ValidatedInput type="date" name="endDate" placeholder="End date" />
              <ValidatedInput type="time" name="endTime" placeholder="End time" />
            </div>
          </div>
          <p className="text-gray-400 italic">
            Authors must claim this topic by (local timestamp) to submit question ideas
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold">When must peer review be complete and winners selected by?</h2>
          <ValidatedInput type="date" name="reviewEndDate" placeholder="End date" />
          <ValidatedInput type="time" name="reviewEndTime" placeholder="End time" />
          <p className="text-gray-400 italic">
            Reviewers must claim this topic by (local timestamp) to score questions
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-bold">Rewards</h2>
          <div className="flex flex-col md:flex-row gap-2 items-baseline">
            <div className="flex-grow w-full">
              <ValidatedSelect
                name="rewardToken"
                placeholder="Token"
                options={[
                  { label: "ETH", value: "ETH" },
                  { label: "SOL", value: "SOL" },
                ]}
              />
            </div>
            <div className="flex-grow w-full">
              <ValidatedInput name="rewardPool" placeholder="Token amount distributed across winners" />
            </div>
          </div>
          <p className="text-gray-400 italic">
            Rewards will be distributed to the top 10% of authors based on the Aggressive reward curve set for the
            challenge marketplace
          </p>
        </section>

        <div className="flex flex-row flex-wrap gap-5">
          <Button variant="primary">Launch Challenge</Button>
          <Button variant="cancel">Cancel</Button>
        </div>
      </ValidatedForm>
    </Container>
  );
}

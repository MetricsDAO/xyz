import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Button } from "~/components/button";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { Textarea } from "~/components/Textarea";

export default function CreateChallenge() {
  const marketplace = true;

  return (
    <div className="mx-auto max-w-3xl space-y-10 my-10 px-5">
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

      <ValidatedForm validator={withZod(z.any())} className="space-y-10">
        <section className="flex flex-row flex-wrap gap-5">
          <div className="flex-1">
            <Select
              name="marketplace"
              options={[
                { label: "Marketplace 1", value: "marketplace1" },
                { label: "Marketplace 2", value: "marketplace2" },
              ]}
              placeholder={"Select Challenge Marketplace"}
            />
          </div>
          <div className="flex flex-row items-center gap-5">
            <p>or</p>
            <Button variant="outline" size="md" disabled={marketplace}>
              Create New Marketplace
            </Button>
          </div>
        </section>
        {marketplace && (
          <>
            <section className="space-y-3">
              <h2 className="font-bold">Challenge Title</h2>
              <Input name="title" placeholder="Challenge Title" className="w-full" />
            </section>
            <section className="space-y-3">
              <h2 className="font-bold">What do you want to source questions about?</h2>
              <Textarea
                name="description"
                placeholder="Crowdsource the best questions for blockchain analysts to answer about any web3 topic."
              />
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-grow">
                  <Select
                    name="language"
                    placeholder="Language"
                    options={[
                      { label: "English", value: "english" },
                      { label: "Spanish", value: "spanish" },
                    ]}
                  />
                </div>
                <div className="flex-grow">
                  <Select
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
                  {/* Placeholder until we have datepicker */}
                  <Input name="startDate" placeholder="Start date and time" />
                </div>
                <div className="flex-grow">
                  {/* Placeholder until we have datepicker */}
                  <Input name="endDate" placeholder="End date and time" />
                </div>
              </div>
              <p className="text-gray-400 italic">
                Authors must claim this topic by (local timestamp) to submit question ideas
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-bold">When must peer review be complete and winners selected by?</h2>
              {/* Placeholder until we have datepicker */}
              <Input name="startDate" placeholder="Set date and time" />
              <p className="text-gray-400 italic">
                Reviewers must claim this topic by (local timestamp) to score questions
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-bold">Rewards</h2>
              <div className="flex flex-col md:flex-row gap-2 items-baseline">
                <div className="flex-grow w-full">
                  <Select
                    name="rewardToken"
                    placeholder="Token"
                    options={[
                      { label: "ETH", value: "ETH" },
                      { label: "SOL", value: "SOL" },
                    ]}
                  />
                </div>
                <div className="flex-grow w-full">
                  {/* Placeholder until we have datepicker */}
                  <Input name="rewardPool" placeholder="Token amount distributed across winners" />
                </div>
              </div>
              <p className="text-gray-400 italic">
                Rewards will be distributed to the top 10% of authors based on the Aggressive reward curve set for the
                challenge marketplace
              </p>
            </section>
          </>
        )}
      </ValidatedForm>

      <div>
        <div className="flex flex-row gap-5">
          <Button variant="primary">Launch Challenge</Button>
          <Button variant="cancel">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

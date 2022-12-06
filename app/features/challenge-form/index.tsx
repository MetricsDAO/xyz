import type { LaborMarket } from "@prisma/client";
import { Fragment } from "react";
import { Button } from "~/components/button";
import { ValidatedCombobox } from "~/components/combobox/combobox";
import { ValidatedInput } from "~/components/input/input";
import { ValidatedSelect } from "~/components/select";
import { ValidatedTextarea } from "~/components/Textarea";

export function ChallengeForm({ laborMarkets }: { laborMarkets: LaborMarket[] }) {
  return (
    <div className="space-y-10 py-5">
      <section className="space-y-1">
        <p className="text-cyan-500 text-lg">
          Reward peers to crowdsource the best questions for crypto analysts to answer about any web3 topic
        </p>
        <p className="text-sm text-gray-500">
          You launch a brainstorm challenge. Peers submit their best question ideas. Reviewers surface winning questions
          and those winners earn tokens from your reward pool!
        </p>
      </section>

      <section className="flex items-center space-x-4">
        <div className="flex-1">
          <ValidatedCombobox
            name="laborMarketAddress"
            options={laborMarkets.map((lm) => ({ value: lm.address, label: lm.title }))}
          />
        </div>
        <p>or</p>
        <Button size="lg" variant="outline">
          Create Marketplace
        </Button>
      </section>

      {true ? (
        <Fragment>
          <ValidatedInput name="title" label="Challenge Title" />

          <ValidatedTextarea name="description" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedSelect name="language" options={[]} />
            <ValidatedSelect name="projectIds" options={[]} />
          </div>

          <section>
            <h4 className="font-semibold mb-3">When will submissions be accepted?</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput name="startDate" label="Start Date" />
              <ValidatedInput name="endDate" label="End Date" />
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="font-semibold">When must peer review be complete and winners selected by?</h4>
            <ValidatedInput name="reviewDate" />
            <p className="text-gray-400 font-light italic">Reviewers must claim this topic by </p>
          </section>

          <section className="space-y-3">
            <h4 className="font-semibold">Rewards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedSelect name="tokenId" options={[]} />
              <ValidatedInput name="rewardPool" label="Reward Pool" />
            </div>
            <p className="text-gray-400 italic font-light">
              Rewards will be distributed to the top 10% of authors based on the Aggressive reward curve set for the
              challenge marketplace
            </p>
          </section>
        </Fragment>
      ) : null}
    </div>
  );
}

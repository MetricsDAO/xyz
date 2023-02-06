import type { Project, Token } from "@prisma/client";
import { useParams } from "@remix-run/react";
import { Field, ValidatedInput, ValidatedTextarea, ValidatedSelect, Error, ValidatedCombobox } from "~/components";

export function ChallengeForm({ validTokens, validProjects }: { validTokens: Token[]; validProjects: Project[] }) {
  const { mType } = useParams();
  return (
    <>
      <section className="space-y-3">
        <h2 className="font-bold">Challenge Title</h2>
        <Field>
          <ValidatedInput name="title" placeholder="Challenge Title" className="w-full" />
          <Error name="title" />
        </Field>
      </section>
      <section className="space-y-3">
        {mType === "brainstorm" ? <BrainstormTextArea /> : <AnalyticsTextArea />}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-grow">
            <Field>
              <ValidatedSelect
                name="language"
                placeholder="Language"
                options={[{ label: "English", value: "english" }]}
              />
              <Error name="language" />
            </Field>
          </div>
          <div className="flex-grow">
            <Field>
              <ValidatedCombobox
                placeholder="Blockchain/Project(s)"
                name="projectSlugs"
                options={validProjects.map((p) => ({ label: p.name, value: p.slug }))}
              />
              <Error name="projectSlugs" />
            </Field>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold">When will submissions be accepted</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-grow">
            <p>Start</p>
            <Field>
              <ValidatedInput type="date" name="startDate" placeholder="Start date" />
              <Error name="startDate" />
            </Field>
            <Field>
              <ValidatedInput type="time" name="startTime" placeholder="Start time" />
              <Error name="startTime" />
            </Field>
          </div>
          <div className="flex-grow">
            <p>End</p>
            <Field>
              <ValidatedInput type="date" name="endDate" placeholder="End date" />
              <Error name="endDate" />
            </Field>
            <Field>
              <ValidatedInput type="time" name="endTime" placeholder="End time" />
              <Error name="endTime" />
            </Field>
          </div>
        </div>
        <p className="text-gray-400 italic">
          Authors must claim this topic by (local timestamp) to submit question ideas
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold">When must peer review be complete and winners selected by?</h2>
        <Field>
          <ValidatedInput type="date" name="reviewEndDate" placeholder="End date" />
          <Error name="reviewEndDate" />
        </Field>
        <Field>
          <ValidatedInput type="time" name="reviewEndTime" placeholder="End time" />
          <Error name="reviewEndTime" />
        </Field>
        <p className="text-gray-400 italic">Reviewers must claim this topic by (local timestamp) to score questions</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-bold">Rewards</h2>
        <div className="flex flex-col md:flex-row gap-2 items-baseline">
          <div className="flex-grow w-full">
            <Field>
              <ValidatedSelect
                name="rewardToken"
                placeholder="Token"
                options={validTokens.map((t) => {
                  return { label: t.symbol, value: t.contractAddress };
                })}
              />
              <Error name="rewardToken" />
            </Field>
          </div>
          <div className="flex-grow w-full">
            <Field>
              <ValidatedInput name="rewardPool" placeholder="Token amount distributed across winners" />
              <Error name="rewardPool" />
            </Field>
          </div>
        </div>
        <p className="text-gray-400 italic">
          Rewards are distributed based on overall submission scores. Higher scores are rewarded more.
        </p>
      </section>
    </>
  );
}

function BrainstormTextArea() {
  return (
    <>
      <h2 className="font-bold">Ask the community what they would like to see Web3 analysts address</h2>
      <Field>
        <ValidatedTextarea
          name="description"
          rows={7}
          placeholder="Enter a prompt to source ideas on questions to answer, problems to solve, or tools to create for a specific chain/project, theme, or topic. 

    Example: What are the most important questions to answer about user behavior on Ethereum?"
        />
        <Error name="description" />
      </Field>
    </>
  );
}

function AnalyticsTextArea() {
  return (
    <>
      <h2 className="font-bold">What question, problem, or tooling need do you want Web3 analysts to address?</h2>
      <Field>
        <ValidatedTextarea
          name="description"
          rows={7}
          placeholder="Enter a question to answer, problem to solve, or tool to create. 

          Be specific. Define metrics. Specify time boundaries. Example: How many addresses have transferred SUSHI on Ethereum in the last 90 days?"
        />
        <Error name="description" />
      </Field>
    </>
  );
}

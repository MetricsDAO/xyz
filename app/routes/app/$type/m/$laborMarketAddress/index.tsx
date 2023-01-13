import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import { Link, useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import type { DataFunctionArgs, UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { ValidatedForm } from "remix-validated-form";
import { ProjectAvatar } from "~/components/avatar";
import { Badge } from "~/components/badge";
import { Card } from "~/components/card";
import { Checkbox } from "~/components/checkbox";
import { ValidatedCombobox } from "~/components/combobox";
import { Countdown } from "~/components/countdown";
import { Field, Label } from "~/components/field";
import { ValidatedInput } from "~/components/input/input";
import { Pagination } from "~/components/pagination/pagination";
import { ValidatedSelect } from "~/components/select";
import { Header, Row, Table } from "~/components/table";
import { ServiceRequestSearchSchema } from "~/domain/service-request";
import { countChallenges, searchChallenges } from "~/services/challenges-service.server";

const validator = withZod(ServiceRequestSearchSchema);

export const loader = async (data: DataFunctionArgs) => {
  const url = new URL(data.request.url);
  const params = getParamsOrFail(url.searchParams, ServiceRequestSearchSchema);
  const paramsWithLaborMarketId = { ...params, laborMarket: data.params.id };
  const challenges = await searchChallenges(paramsWithLaborMarketId);
  const totalResults = await countChallenges(paramsWithLaborMarketId);
  return typedjson({ challenges, totalResults, params });
};

export default function MarketplaceIdChallenges() {
  const { totalResults, params, challenges } = useTypedLoaderData<typeof loader>();

  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <ChallengesListView challenges={challenges} />
          <div className="w-fit m-auto">
            <Pagination page={params.page} totalPages={Math.ceil(totalResults / params.first)} />
          </div>
        </div>
      </main>
      <aside className="md:w-1/5">
        <SearchAndFilter />
      </aside>
    </section>
  );
}

function SearchAndFilter() {
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };

  return (
    <ValidatedForm
      formRef={formRef}
      method="get"
      validator={validator}
      onChange={handleChange}
      className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-blue-300 bg-opacity-5"
    >
      <ValidatedInput
        placeholder="Search"
        name="q"
        size="sm"
        iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      />
      <h3 className="font-semibold">Sort:</h3>
      <ValidatedSelect
        placeholder="Select option"
        name="sortBy"
        onChange={handleChange}
        size="sm"
        options={[
          { label: "Title", value: "title" },
          { label: "Submit Deadline", value: "submit" },
          { label: "Review Deadline", value: "review" },
          { label: "Reward Pool", value: "reward" },
        ]}
      />
      <h3 className="font-semibold">Filter:</h3>
      <p>I am able to:</p>
      <Checkbox id="submit_checkbox" name="permission" value="submit" label="Submit" />
      <Checkbox id="review_checkbox" name="permission" value="review" label="Review" />
      <Field>
        <Label>Reward Token</Label>
        <ValidatedCombobox
          onChange={handleChange}
          placeholder="Select option"
          name="reward"
          size="sm"
          options={[
            { label: "Solana", value: "Solana" },
            { label: "Ethereum", value: "Ethereum" },
            { label: "USD", value: "USD" },
          ]}
        />
      </Field>
      <Field>
        <Label>Chain/Project</Label>
        <ValidatedCombobox
          onChange={handleChange}
          placeholder="Select option"
          name="project"
          size="sm"
          options={[
            { label: "Solana", value: "Solana" },
            { label: "Ethereum", value: "Ethereum" },
          ]}
        />
      </Field>
      <Field>
        <Label>Language</Label>
        <ValidatedCombobox
          onChange={handleChange}
          placeholder="Select option"
          name="language"
          size="sm"
          options={[{ label: "English", value: "English" }]}
        />
      </Field>
    </ValidatedForm>
  );
}

type MarketplaceChallengesTableProps = {
  challenges: UseDataFunctionReturn<typeof loader>["challenges"];
};

function MarketplacesChallengesTable({ challenges }: MarketplaceChallengesTableProps) {
  return (
    <Table>
      <Header columns={6} className="mb-2">
        <Header.Column span={2}>Challenge</Header.Column>
        <Header.Column>Chain/Project</Header.Column>
        <Header.Column>Reward Pool</Header.Column>
        <Header.Column>Submit Deadline</Header.Column>
        <Header.Column>Review Deadline</Header.Column>
      </Header>
      {challenges.map((c) => {
        return (
          <Row asChild columns={6} key={c.contractId}>
            <Link to={`/app/brainstorm/m/${c.laborMarketAddress}/sr/${c.contractId}`} className="text-sm font-medium">
              <Row.Column span={2}>{c.title}</Row.Column>
              <Row.Column>
                <div className="flex">
                  <div>
                    {c.laborMarket.projects?.map((p) => (
                      <Badge key={p.slug} className="pl-2">
                        <ProjectAvatar project={p} />
                        <span className="mx-1">{p.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </Row.Column>

              <Row.Column>5 Sol</Row.Column>
              <Row.Column>
                <Countdown date={"2023-01-25"} />
              </Row.Column>
              <Row.Column>
                <Countdown date={"2022-11-25"} />
              </Row.Column>
            </Link>
          </Row>
        );
      })}
    </Table>
  );
}

function MarketplacesChallengesCard({ challenges }: MarketplaceChallengesTableProps) {
  return (
    <div className="space-y-4">
      {challenges.map((c) => {
        return (
          <Card asChild key={c.contractId}>
            <Link
              to={`/app/brainstorm/m/${c.laborMarketAddress}/sr/${c.contractId}`}
              className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5"
            >
              <div>Challenges</div>
              <div className="text-sm font-medium">{c.title}</div>

              <div>Chain/Project</div>
              <div className="flex">
                <div>
                  {c.laborMarket.projects?.map((p) => (
                    <Badge key={p.slug} className="pl-2">
                      <ProjectAvatar project={p} />
                      <span className="mx-1">{p.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>Reward Pool</div>
              <div>5 Sol</div>
              <div>Submit Deadline</div>
              <div className="text-gray-500 text-sm">
                <Countdown date={"2023-01-25"} />
              </div>
              <div>Review Deadline</div>
              <div className="text-gray-500 text-sm">
                <Countdown date={"2022-11-25"} />
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}

function ChallengesListView({ challenges }: MarketplaceChallengesTableProps) {
  if (challenges.length === 0) {
    return <p>No results. Try changing search and filter options.</p>;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <MarketplacesChallengesTable challenges={challenges} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <MarketplacesChallengesCard challenges={challenges} />
      </div>
    </>
  );
}

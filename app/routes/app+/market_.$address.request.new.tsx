import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { badRequest, notFound } from "remix-utils";
import { z } from "zod";
import { EvmAddressSchema } from "~/domain/address";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import { fakeServiceRequestFormData } from "~/features/service-request-creator/schema";
import { ServiceRequestCreator } from "~/features/service-request-creator/service-request-creator";
import { findProjectsBySlug } from "~/services/projects.server";
import { listTokens } from "~/services/tokens.server";
import { requireUser } from "~/services/session.server";
import { Button } from "~/components/button";
import { Progress } from "~/components/progress";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "@remix-run/react";

const paramsSchema = z.object({ address: EvmAddressSchema });

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(params);
  await requireUser(request, `/app/login?redirectto=app/market/${address}/request/new`);
  const laborMarket = await getIndexedLaborMarket(address);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }
  const url = new URL(request.url);
  const defaultValues = url.searchParams.get("fake") ? fakeServiceRequestFormData() : undefined;
  const tokens = await listTokens();

  if (!laborMarket.appData) {
    throw badRequest("Labor market app data is required");
  }
  const laborMarketProjects = await findProjectsBySlug(laborMarket.appData.projectSlugs);
  return typedjson({ defaultValues, laborMarket, laborMarketProjects, tokens });
};

export default function CreateServiceRequest() {
  const { defaultValues, tokens, laborMarketProjects, laborMarket } = useTypedLoaderData<typeof loader>();
  const [page, setPage] = useState<number>(1);
  const [header, setHeader] = useState<boolean>(true);

  function updatePage(newPage: number) {
    setPage(newPage);
    if (newPage === 4) {
      setHeader(false);
    } else {
      setHeader(true);
    }
  }

  const validTokens = laborMarket.appData.tokenAllowlist
    .map((symbol) => tokens.find((t) => t.symbol === symbol))
    .filter((t): t is typeof tokens[number] => !!t);

  const steps = [
    {
      label: "Create",
    },
    {
      label: "Analysts",
    },
    {
      label: "Reviewers",
    },
    {
      label: "Overview",
    },
  ];

  return (
    <>
      <div className="max-w-2xl mx-auto my-10 space-y-10">
        <div>
          <ServiceRequestCreator
            projects={laborMarketProjects}
            tokens={validTokens}
            defaultValues={defaultValues}
            laborMarketAddress={laborMarket.address}
            page={page}
            header={header}
          />
          <aside className="hidden md:block w-1/6">
            {/*
            <Stepper alternativeLabel activeStep={1}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
              */}
          </aside>
        </div>
      </div>
      <div className="w-full">
        <Progress progress={page * 25} />
        <div className="flex items-center justify-evenly">
          <div className="flex items-center">
            <div className="flex gap-3 items-center cursor-pointer" onClick={() => updatePage(page - 1)}>
              <ArrowLeftCircleIcon className="h-8 w-8 text-black" />
              <p className="mr-6">Prev</p>
            </div>

            <div className="flex gap-3 items-center cursor-pointer" onClick={() => updatePage(page + 1)}>
              <p>Next</p>
              <ArrowRightCircleIcon className="h-8 w-8 text-black" />
            </div>
          </div>
          <div className="flex items-center">
            <Button className="my-5 mr-4" variant="cancel">
              <Link to={`/app/market/${laborMarket.address}`}>Cancel</Link>
            </Button>
            {page === 4 && <Button>Launch Challenge</Button>}
          </div>
        </div>
      </div>
    </>
  );
}

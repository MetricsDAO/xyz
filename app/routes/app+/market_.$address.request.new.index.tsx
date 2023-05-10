import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.$address.request.new";
import { Step1Fields } from "~/features/service-request-creator/step1-fields";
import { Step1Form } from "~/features/service-request-creator/schema";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireUser } from "~/services/session.server";
import { notFound } from "remix-utils";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";
import { EvmAddressSchema } from "~/domain/address";
import { findProjectsBySlug } from "~/services/projects.server";
import { z } from "zod";

const paramsSchema = z.object({ address: EvmAddressSchema });

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const { address } = paramsSchema.parse(params);
  await requireUser(request, `/app/login?redirectto=app/market/${address}/request/new`);

  const laborMarket = await getIndexedLaborMarket(address);
  if (!laborMarket) {
    throw notFound("Labor market not found");
  }
  const laborMarketProjects = await findProjectsBySlug(laborMarket.appData.projectSlugs);
  return typedjson({ address, laborMarketProjects });
};

export default function Step1Page() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  const { laborMarketProjects, address } = useTypedLoaderData<typeof loader>();
  return (
    <Step1Fields
      currentData={formData.page1Data}
      projects={laborMarketProjects}
      onDataUpdate={(data: Step1Form) => {
        setFormData((prevData) => ({ ...prevData, page1Data: data }));
      }}
      address={address}
    />
  );
}
//const paramsSchema = z.object({ address: EvmAddressSchema });

/*export const loader = async ({ request, params }: DataFunctionArgs) => {
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
}*/

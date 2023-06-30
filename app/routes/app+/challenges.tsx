import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useRef } from "react";
import { useSubmit } from "react-router-dom";
import { getSearchParamsOrFail } from "remix-params-helper";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Container } from "~/components";
import { Pagination } from "~/components/pagination";
import { countServiceRequests, searchServiceRequests } from "~/domain/service-request/functions.server";
import { ServiceRequestSearchSchema } from "~/domain/service-request/schemas";
import { ListChallenges } from "~/features/challenges/list-challenges/list-challenges";
import { SearchChallenges } from "~/features/challenges/search-challenges/search-challenges";

export async function loader({ request }: DataFunctionArgs) {
  const searchParams = getSearchParamsOrFail(request, ServiceRequestSearchSchema);
  const serviceRequests = await searchServiceRequests(searchParams);
  const totalResults = await countServiceRequests(searchParams);
  return typedjson({ serviceRequests, searchParams, totalResults });
}

export default function Challenges() {
  const { serviceRequests, totalResults, searchParams } = useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const searchRef = useRef<HTMLFormElement>(null);
  const onSearch = () => {
    submit(searchRef.current);
  };

  return (
    <Container className="py-16 px-10">
      <header className="flex flex-col justify-between md:flex-row space-y-7 md:space-y-0 space-x-0 md:space-x-5 mb-20">
        <div className="flex-1 space-y-3 max-w-2xl">
          <h1 className="font-semibold text-3xl">Analytics Challenges</h1>
          <p className="text-lg text-cyan-500">
            Tap the world’s best Web3 analyst community to deliver quality analytics, tooling, or content that helps
            projects launch, grow and succeed.
          </p>
          <p className="text-sm text-gray-500">
            You fund and launch an Analytics challenge. Analysts submit work. Peer reviewers score and surface the best
            outputs. Winners earn tokens from your reward pool!
          </p>
        </div>
      </header>

      <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <div className="flex-1">
          <ListChallenges serviceRequests={serviceRequests} />
          <div className="w-fit m-auto">
            {/* Not really getting used since page size is large */}
            <Pagination page={searchParams.page} totalPages={Math.ceil(totalResults / searchParams.first)} />
          </div>
        </div>
        <aside className="md:w-1/5">
          <SearchChallenges ref={searchRef} onSubmit={onSearch} defaultValues={searchParams} />
        </aside>
      </div>
    </Container>
  );
}

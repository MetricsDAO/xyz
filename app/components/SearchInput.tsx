import { Search16 } from "@carbon/icons-react";
import { useFetcher } from "@remix-run/react";

export default function SearchInput() {
  const fetcher = useFetcher();

  return (
    <div className="tw-mt-6">
      <fetcher.Form
        method="get"
        className="tw-flex tw-flex-row tw-space-x-2 tw-bg-[#F7F7F7] tw-rounded-full tw-h-11 tw-w-full tw-items-center tw-px-3 tw-border"
      >
        <Search16 className="tw-fill-[#4D4D4D]" data-test-id="search-submissions-icon" />
        <input
          data-test-id="search-submissions-header"
          className="tw-bg-transparent tw-mr-0 tw-min-w-0 tw-text-[#4D4D4D]"
          name="user-query"
          placeholder="Search questions"
        />
      </fetcher.Form>
    </div>
  );
}

import { useSearchParams } from "@remix-run/react";
import { useCallback } from "react";

/**
 * convenience hook for updating query params with Remix. Works additively. To remove params, pass in null for the key's value.
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQueryParams = useCallback(
    (newParams: Record<string, string | null>) => {
      let updatedSearchParams = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === "" || value === null) {
          updatedSearchParams.delete(key);
        } else {
          updatedSearchParams.set(key, value);
        }
      });
      setSearchParams(updatedSearchParams, { replace: true, state: { scroll: false } });
    },
    [searchParams, setSearchParams]
  );

  return [searchParams, updateQueryParams] as [typeof searchParams, typeof updateQueryParams];
}

import { useSearchParams } from "@remix-run/react";

/**
 * This hook will update the search params in the URL using a form and remove any empty values.
 * Mostly used in filtered lists.
 */
export function useUpdateSearchParams() {
  const [params, setParams] = useSearchParams();
  return (data: FormData) => {
    const entries = data.entries();
    for (const [key, value] of entries) {
      if (value.toString().length > 0) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    }
    setParams(params, { replace: true });
  };
}

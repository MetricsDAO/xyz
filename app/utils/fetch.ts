import type { LaborMarket } from "~/domain";

export function createLaborMarket(data: LaborMarket) {
  fetch("/api/indexer/create-labor-market", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

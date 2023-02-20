import type { LaborMarket, ServiceRequestIndexer } from "~/domain";

export function createLaborMarket(data: LaborMarket) {
  fetch("/api/indexer/create-labor-market", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function openNewServiceRequest(data: ServiceRequestIndexer) {
  fetch("/api/indexer/create-service-request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

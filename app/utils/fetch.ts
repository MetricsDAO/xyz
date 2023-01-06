import type { ServiceRequestContract, LaborMarket } from "~/domain";

export function createLaborMarket(data: LaborMarket) {
  fetch("/api/indexer/create-labor-market", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createServiceRequest(data: ServiceRequestContract) {
  fetch("/api/indexer/create-service-request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

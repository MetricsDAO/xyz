import { z } from "zod";
import { ServiceRequestConfigSchema, ServiceRequestMetaSchema } from "~/domain/service-request/schemas";

export const ServiceRequestFormValuesSchema = z.object({
  laborMarketAddress: z.string(),
  appData: ServiceRequestMetaSchema,
  configuration: ServiceRequestConfigSchema,
});

export type ServiceRequestFormValues = z.infer<typeof ServiceRequestFormValuesSchema>;

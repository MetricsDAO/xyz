import { faker } from "@faker-js/faker";
import { ServiceRequestFormSchema } from "~/features/service-request-creator/schema";

describe("ServiceRequestFormSchema", () => {
  test("base test", () => {
    const sr = {
      contractId: faker.datatype.string(),
      laborMarketAddress: faker.finance.ethereumAddress(),
      appData: { title: "Test", description: "Test", language: "english", projectSlugs: ["ethereum"] },
      startDate: "2021-01-01",
      startTime: "12:00",
      endDate: "2021-01-01",
      endTime: "12:00",
      reviewEndDate: "2021-02-01",
      reviewEndTime: "12:00",
      rewardToken: faker.finance.ethereumAddress(),
      rewardPool: "0.005",
    };
    const result = ServiceRequestFormSchema.safeParse(sr);
    expect(result.success).toBe(true);
  });
});

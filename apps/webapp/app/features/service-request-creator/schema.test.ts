import { faker } from "@faker-js/faker";
import { ServiceRequestFormSchema } from "~/features/service-request-creator/schema";

describe("ServiceRequestFormSchema", () => {
  test("base test", () => {
    const sr = {
      contractId: faker.datatype.string(),
      laborMarketAddress: faker.finance.ethereumAddress(),
      appData: { title: "Test", description: "Test", language: "english", projectSlugs: ["ethereum"] },
      analyst: {
        startDate: "2021-01-01",
        startTime: "12:00",
        endDate: "2021-01-01",
        endTime: "12:00",
        rewardToken: faker.finance.ethereumAddress(),
        rewardTokenDecimals: 18,
        maxReward: "0.005",
        submitLimit: 10,
      },
      reviewer: {
        reviewEndDate: "2021-02-01",
        reviewEndTime: "12:00",
        rewardToken: faker.finance.ethereumAddress(),
        rewardTokenDecimals: 18,
        maxReward: "0.005",
        reviewLimit: 10,
      },
    };
    const result = ServiceRequestFormSchema.safeParse(sr);
    expect(result.success).toBe(true);
  });
});

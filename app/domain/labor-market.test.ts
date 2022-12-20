import { faker } from "@faker-js/faker";
import type { LaborMarketNew } from "./labor-market";
import { LaborMarketNewSchema } from "./labor-market";

describe("LaborMarketNewSchema", () => {
  test("launchAccess 'delegates' requires badger props", () => {
    const laborMarket: LaborMarketNew = {
      title: "Test",
      description: "Test",
      type: "brainstorm",
      submitRepMin: 1,
      submitRepMax: 100,
      rewardCurveAddress: faker.finance.ethereumAddress(),
      reviewBadgerAddress: faker.finance.ethereumAddress(),
      reviewBadgerTokenId: "foo",
      tokenSymbols: ["METRIC"],
      projectIds: ["1"],
      // @ts-expect-error - so we can simulate a bad input from the client
      launch: {
        access: "delegates",
      },
      userAddress: faker.finance.ethereumAddress(),
    };
    const result = LaborMarketNewSchema.safeParse(laborMarket);
    expect(result.success).toBe(false);
    assert(result.success === false);
    expect(result.error.issues.length).toEqual(2);
  });

  test("launchAccess 'delegates' with valid badger props", () => {
    const validLaborMarket: LaborMarketNew = {
      title: "Test",
      description: "Test",
      type: "brainstorm",
      submitRepMin: 1,
      submitRepMax: 100,
      rewardCurveAddress: faker.finance.ethereumAddress(),
      reviewBadgerAddress: faker.finance.ethereumAddress(),
      reviewBadgerTokenId: "foo",
      tokenSymbols: ["METRIC"],
      projectIds: ["1"],
      launch: {
        access: "delegates",
        badgerAddress: faker.finance.ethereumAddress(),
        badgerTokenId: "1",
      },
      userAddress: faker.finance.ethereumAddress(),
    };
    const result = LaborMarketNewSchema.safeParse(validLaborMarket);
    expect(result.success).toBe(true);
  });
});

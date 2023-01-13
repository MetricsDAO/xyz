import { indexLaborMarket } from "./indexing.server";

// https://polygonscan.com/address/0x6ebbe4a8c2f58bdb59f906cb1fc5a14b2bf5471c#events
const ADDRESS_WITH_INVALID_HASH = "0xD2252495279B6919599a9C66942700417e62c1cA";

describe("IndexingService", () => {
  test("should throw if ipfs data is invalid", async () => {
    await expect(indexLaborMarket(ADDRESS_WITH_INVALID_HASH)).rejects.toThrow();
  });
});

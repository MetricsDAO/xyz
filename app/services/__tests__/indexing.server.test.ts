import { indexLaborMarket } from "../../../indexer/functions";

describe("Indexing functions", () => {
  test("indexLaborMarket throws with invalid ipfs hash", async () => {
    const TEST_ADDRESS = "0xaacd872bcb52d633e93d4b01c62fa6f796cc9445"; // https://polyscan.io/address/0xaacd872bcb52d633e93d4b01c62fa6f796cc9445
    const TEST_BLOCK_NUM = 38203173;
    await expect(indexLaborMarket(TEST_ADDRESS, TEST_BLOCK_NUM)).rejects.toThrow();
  });

  test("indexLaborMarket success", async () => {
    const TEST_ADDRESS = "0xaacd872bcb52d633e93d4b01c62fa6f796cc9445"; // https://polyscan.io/address/0xaacd872bcb52d633e93d4b01c62fa6f796cc9445
    const TEST_BLOCK_NUM = 38203173;
    const laborMarket = await indexLaborMarket(TEST_ADDRESS, TEST_BLOCK_NUM);
    expect(laborMarket).toMatchSnapshot();
  });
});

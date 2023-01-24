describe("indexLaborMarketConfigured", () => {
  test("throws if the ipfs request fails for any reason apart from 404");
  test("throws if the onchain data isn't valid");
  test("throws if the db upsert fails");
  test("skips if the ipfs data isn't valid");
});

// describe("Indexing functions", () => {
//   test("indexLaborMarket throws with invalid ipfs hash", async () => {
//     const TEST_ADDRESS = "0xaacd872bcb52d633e93d4b01c62fa6f796cc9445"; // https://polyscan.io/address/0xaacd872bcb52d633e93d4b01c62fa6f796cc9445
//     const TEST_BLOCK_NUM = 38203173;
//     await expect(indexLaborMarketConfigured(TEST_ADDRESS, TEST_BLOCK_NUM)).rejects.toThrow();
//   });

//   test("indexLaborMarket success", async () => {
//     const TEST_ADDRESS = "0xaacd872bcb52d633e93d4b01c62fa6f796cc9445"; // https://polyscan.io/address/0xaacd872bcb52d633e93d4b01c62fa6f796cc9445
//     const TEST_BLOCK_NUM = 38203173;
//     const laborMarket = await indexLaborMarketConfigured(TEST_ADDRESS, TEST_BLOCK_NUM);
//     expect(laborMarket).toMatchSnapshot();
//   });
// });

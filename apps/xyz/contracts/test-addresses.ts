// Map of test contract names to test deployment addresses on the Polygon network.
// This can be used with the ABIs from "labor-markets-abi" to do stuff on the test deployments.
export const testAddresses = {
  PaymentToken: "0xD1Dee0DD6C89FB4d902818C54DD88B3555Ad7df2",
  ReputationToken: "0x0034F6CF1ec2A5b51497D06C0619985945F6A5d4",
  LaborMarket: "0xB9464209bEeb537050A5278AEB4E450E7C0Bed0A",
  ReputationEngine: "0x1585c93cf4F74230F6dC4378cDa2B98187A4A40E",
  LaborMarketNetwork: "0x6EbBE4A8c2F58bDB59F906Cb1Fc5A14B2bF5471C",
  ReputationModule: "0xcb2241adD515189b661423E04d9917fFDb90CD01",
  LikertEnforcement: "0xA49d7AE1aa90e384704749Ea78093577a70cD87c",
  PaymentModule: "0x83e16f89627B1Ce73F5000c1225f4673a2Cf3deB",
  PayCurve: "0x67bf50b4688Ff31194C74084D8c0903F59cb098B",
} as const;

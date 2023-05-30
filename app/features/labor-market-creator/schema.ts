import { faker } from "@faker-js/faker";
import { z } from "zod";
import {
  LaborMarketAppDataSchema,
  LaborMarketConfigSchema,
  finalMarketSchema,
  LaborMarketReputationParams,
  marketplaceDetailsSchema,
} from "~/domain/labor-market/schemas";

export const MarketNewValuesSchema = z.object({
  appData: LaborMarketAppDataSchema,
  configuration: finalMarketSchema,
});

export type MarketNewValues = z.infer<typeof MarketNewValuesSchema>;

// export function fakeLaborMarketFormValues(): MarketNewValues {
//   return {
//     appData: {
//       title: faker.commerce.productName(),
//       description: faker.lorem.paragraphs(2),
//       type: "analyze",
//       projectSlugs: ["ethereum", "polygon"],
//       tokenAllowlist: ["eth"],
//     },
//     configuration: {
//       modules: {
//         enforcement: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
//         network: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
//         enforcementKey: "aggressive",
//         reputation: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
//       },
//       delegateBadge: {
//         token: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
//         tokenId: "2",
//       },
//       maintainerBadge: {
//         token: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
//         tokenId: "3",
//       },
//       reputationBadge: {
//         token: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
//         tokenId: "4",
//       },
//       reputationParams: {
//         rewardPool: faker.datatype.number(100),
//         provideStake: faker.datatype.number(100),
//         reviewStake: faker.datatype.number(100),
//         submitMin: 0,
//       },
//     },
//   };
// }

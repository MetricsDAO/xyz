import { faker } from "@faker-js/faker";
import { z } from "zod";
import {
  LaborMarketAppDataSchema,
  LaborMarketConfigSchema,
  LaborMarketReputationParams,
} from "~/domain/labor-market/schemas";

export const LaborMarketFormValuesSchema = z.object({
  appData: LaborMarketAppDataSchema,
  delegatePermission: z.enum(["anyone", "delegates"]).default("anyone"),
  configuration: LaborMarketConfigSchema.sourceType()
    .omit({ marketUri: true, owner: true })
    .extend({
      reputationParams: LaborMarketReputationParams.extend({
        rewardPool: z.coerce.number(),
        signalStake: z.coerce.number(),
        provideStake: z.coerce.number(),
        submitMin: z.coerce.number(),
        submitMax: z.coerce.number().optional(),
      }),
    }),
});

export type LaborMarketFormValues = z.infer<typeof LaborMarketFormValuesSchema>;

export function fakeLaborMarketFormValues(): LaborMarketFormValues {
  return {
    delegatePermission: "anyone",
    appData: {
      title: faker.commerce.productName(),
      description: faker.lorem.paragraphs(2),
      type: "brainstorm",
      projectSlugs: ["ethereum", "polygon"],
    },
    configuration: {
      modules: {
        enforcement: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
        network: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
        enforcementKey: "aggressive",
        reputation: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
      },
      delegateBadge: {
        token: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
        tokenId: "2",
      },
      maintainerBadge: {
        token: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
        tokenId: "3",
      },
      reputationBadge: {
        token: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
        tokenId: "4",
      },
      reputationParams: {
        rewardPool: faker.datatype.number(100),
        provideStake: faker.datatype.number(100),
        signalStake: faker.datatype.number(100),
        submitMin: faker.datatype.number(100),
        submitMax: faker.datatype.number(100),
      },
    },
  };
}

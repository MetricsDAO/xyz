import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "~/domain/address";
import { parseDatetime, validateDate, validateTime } from "~/utils/date";
import { toTokenAmount } from "~/utils/helpers";

const validTokenAmount = (amount: string, decimals: number) => {
  try {
    toTokenAmount(amount, decimals);
    return true;
  } catch (e) {
    return false;
  }
};

const InputDateSchema = z.string().refine((d) => {
  return validateDate(d);
});

const InputTimeSchema = z.string().refine((t) => {
  return validateTime(t);
});

function validDeadlines(reviewDate: string, reviewTime: string, submitDate: string, submitTime: string) {
  return parseDatetime(reviewDate, reviewTime) > parseDatetime(submitDate, submitTime);
}

export const AppDataSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  language: z.enum(["english", "spanish"]),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
});

export type AppDataForm = z.infer<typeof AppDataSchema>;

export const AnalystSchema = z
  .object({
    endDate: InputDateSchema,
    endTime: InputTimeSchema,
    rewardToken: EvmAddressSchema,
    rewardTokenDecimals: z.coerce.number().int().positive(),
    maxReward: z.string(),
    submitLimit: z.coerce.number().positive().int(),
  })
  .refine((data) => validTokenAmount(data.maxReward, data.rewardTokenDecimals), {
    message: "Token amount is invalid.",
    path: ["maxReward"],
  });

export type AnalystForm = z.infer<typeof AnalystSchema>;

export const ReviewerSchema = z
  .object({
    reviewEndDate: InputDateSchema,
    reviewEndTime: InputTimeSchema,
    rewardToken: EvmAddressSchema,
    rewardTokenDecimals: z.coerce.number().int().positive(),
    maxReward: z.string(),
    reviewLimit: z.coerce.number().positive().int(),
  })
  .refine((data) => validTokenAmount(data.maxReward, data.rewardTokenDecimals), {
    message: "Token amount is invalid.",
    path: ["maxReward"],
  });

export type ReviewerForm = z.infer<typeof ReviewerSchema>;

export const ServiceRequestFormSchema = z
  .object({
    appData: AppDataSchema,
    analyst: AnalystSchema,
    reviewer: ReviewerSchema,
  })
  .refine(
    (data) =>
      validDeadlines(
        data.reviewer.reviewEndDate,
        data.reviewer.reviewEndTime,
        data.analyst.endDate,
        data.analyst.endTime
      ),
    {
      message: "Review deadline cannot be before submission deadline.",
      path: ["reviewEndTime"],
    }
  );

export type ServiceRequestForm = z.infer<typeof ServiceRequestFormSchema>;

// Generate a fake Service Request for testing using faker.
export function fakeServiceRequestFormData(): ServiceRequestForm {
  const startDate = faker.date.soon();
  const reviewDate = faker.date.future();
  const endDate = faker.date.between(startDate, reviewDate);

  return {
    appData: {
      title: faker.commerce.productName(),
      description: faker.lorem.paragraphs(2),
      language: "english",
      projectSlugs: ["polygon"],
    },
    analyst: {
      endDate: dayjs(endDate).format("YYYY-MM-DD"),
      endTime: dayjs(endDate).format("HH:mm"),
      rewardToken: "0xCce422781e1818821f50226C14E6289a7144a898",
      rewardTokenDecimals: 18,
      maxReward: "1",
      submitLimit: 10,
    },
    reviewer: {
      reviewEndDate: dayjs(reviewDate).format("YYYY-MM-DD"),
      reviewEndTime: dayjs(reviewDate).format("HH:mm"),
      rewardToken: "0xCce422781e1818821f50226C14E6289a7144a898",
      rewardTokenDecimals: 18,
      maxReward: "2",
      reviewLimit: 10,
    },
  };
}

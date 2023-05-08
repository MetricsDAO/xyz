import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "~/domain/address";
import { ServiceRequestAppDataSchema } from "~/domain/service-request/schemas";
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

export const Step1Schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  language: z.enum(["english", "spanish"]),
  projectSlugs: zfd.repeatable(z.array(z.string()).min(1, "Required")),
});

export type Step1Form = z.infer<typeof Step1Schema>;

export const Step2Schema = z
  .object({
    endDate: InputDateSchema,
    endTime: InputTimeSchema,
    rewardToken: EvmAddressSchema,
    rewardTokenDecimals: z.coerce.number().int().positive(),
    rewardPool: z.string(),
    submitLimit: z.number().positive().int(),
  })
  .refine((data) => validTokenAmount(data.rewardPool, data.rewardTokenDecimals), {
    message: "Token amount is invalid.",
    path: ["rewardPool"],
  });

export type Step2Form = z.infer<typeof Step2Schema>;

export const Step3Schema = z
  .object({
    reviewEndDate: InputDateSchema,
    reviewEndTime: InputTimeSchema,
    rewardToken: EvmAddressSchema,
    rewardTokenDecimals: z.coerce.number().int().positive(),
    rewardPool: z.string(),
    reviewLimit: z.number().positive().int(),
  })
  .refine((data) => validTokenAmount(data.rewardPool, data.rewardTokenDecimals), {
    message: "Token amount is invalid.",
    path: ["rewardPool"],
  });

export type Step3Form = z.infer<typeof Step3Schema>;

export const ServiceRequestFormSchema = z
  .object({
    Step1: Step1Schema,
    Step2: Step2Schema,
    Step3: Step3Schema,
  })
  .refine(
    (data) =>
      validDeadlines(data.Step3.reviewEndDate, data.Step3.reviewEndTime, data.Step2.endDate, data.Step2.endTime),
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
    Step1: {
      title: faker.commerce.productName(),
      description: faker.lorem.paragraphs(2),
      language: "english",
      projectSlugs: [],
    },
    Step2: {
      endDate: dayjs(endDate).format("YYYY-MM-DD"),
      endTime: dayjs(endDate).format("HH:mm"),
      rewardToken: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      rewardTokenDecimals: 18,
      rewardPool: "0.000001",
      submitLimit: 10,
    },
    Step3: {
      reviewEndDate: dayjs(reviewDate).format("YYYY-MM-DD"),
      reviewEndTime: dayjs(reviewDate).format("HH:mm"),
      rewardToken: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      rewardTokenDecimals: 18,
      rewardPool: "0.000001",
      reviewLimit: 10,
    },
  };
}

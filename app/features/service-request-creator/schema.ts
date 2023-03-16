import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { EvmAddressSchema } from "~/domain/address";
import { ServiceRequestAppDataSchema } from "~/domain/service-request/schemas";
import { parseDatetime, validateDate, validateTime } from "~/utils/date";
import { toTokenAmount } from "~/utils/helpers";

const TokenAmountSchema = z.string().refine((r) => {
  try {
    toTokenAmount(r);
    return true;
  } catch (e) {
    return false;
  }
}, "Invalid amount");

const InputDateSchema = z.string().refine((d) => {
  return validateDate(d);
});

const InputTimeSchema = z.string().refine((t) => {
  return validateTime(t);
});

function validDeadlines(reviewDate: string, reviewTime: string, submitDate: string, submitTime: string) {
  return parseDatetime(reviewDate, reviewTime) > parseDatetime(submitDate, submitTime);
}

export const ServiceRequestFormSchema = z
  .object({
    appData: ServiceRequestAppDataSchema,
    endDate: InputDateSchema,
    endTime: InputTimeSchema,
    reviewEndDate: InputDateSchema,
    reviewEndTime: InputTimeSchema,
    rewardToken: EvmAddressSchema,
    rewardPool: TokenAmountSchema,
  })
  .refine((data) => validDeadlines(data.reviewEndDate, data.reviewEndTime, data.endDate, data.endTime), {
    message: "Review deadline cannot be before submission deadline.",
    path: ["reviewEndTime"],
  });

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
      projectSlugs: [],
    },
    endDate: dayjs(endDate).format("YYYY-MM-DD"),
    endTime: dayjs(endDate).format("HH:mm"),
    reviewEndDate: dayjs(reviewDate).format("YYYY-MM-DD"),
    reviewEndTime: dayjs(reviewDate).format("HH:mm"),
    rewardToken: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    rewardPool: "0.000001",
  };
}

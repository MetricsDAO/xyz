import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Error, Field, FormProgress, Input, Label, Select } from "~/components";
import type { EvmAddress } from "~/domain/address";
import type { GatingData } from "./schema";
import { GatingSchema } from "./schema";

export function ReviewerPermissionsForm({
  defaultValues,
  onNext,
  onPrevious,
}: {
  defaultValues: GatingData | null;
  onNext: (values: GatingData) => void;
  onPrevious: (values: GatingData) => void;
}) {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<GatingData>({
    defaultValues: {
      ...defaultValues,
    },
    resolver: zodResolver(GatingSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "badges",
  });

  const navigate = useNavigate();
  const formData = watch();

  const onGoBack = () => {
    onPrevious(formData);
  };

  return (
    <div className="w-full justify-between flex flex-col">
      <div className="max-w-2xl mx-auto my-16 space-y-10">
        <section className="space-y-1">
          <h1 className="text-3xl font-semibold antialiased">Reviewer Permissions</h1>
          <p className="text-cyan-500 text-lg">
            Define who has permission to review and score submissions on challenges in this Marketplace. Reviewers
            enforce and elevate quality work from Analysts.
          </p>
        </section>
        <form className="space-y-10 py-5">
          <section className="grid grid-cols-1 align-center md:grid-cols-3 gap-6">
            <Field>
              <Controller
                control={control}
                name="gatingType"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { label: "Anyone", value: "Anyone" },
                      { label: "Any", value: "Any" },
                      { label: "All", value: "All" },
                    ]}
                  />
                )}
              />
              <Error error={errors.gatingType?.message} />
            </Field>
            {formData.gatingType === ("Any" || "All") && (
              <Field>
                <Controller
                  name="numberBadgesRequired"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                  )}
                />
                <Error error={errors.numberBadgesRequired?.message} />
              </Field>
            )}
            {formData.gatingType === ("Any" || "All") ? (
              <span className="text-xs text-black-[#4D4D4D]"> of the following criteria needs to be met. </span>
            ) : (
              <span className="text-xs text-black-[#4D4D4D]"> Can launch challenges in this marketplace. </span>
            )}
          </section>
          {/* Render sponsorBadges array */}
          {fields.map((field, index) => (
            <div key={field.id}>
              <section className="grid grid-cols-1 align-center md:grid-cols-6 gap-6 items-center">
                <Field className="col-span-2">
                  <Label size="sm">Contract Address</Label>
                  <Controller
                    name={`badges[${index}].contractAddress` as `badges.${number}.contractAddress`}
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="text" />
                    )}
                  />
                  <Error error={errors.badges?.[index]?.contractAddress?.message} />
                </Field>
                <Field>
                  <Label size="sm">token ID</Label>
                  <Controller
                    name={`badges[${index}].tokenId` as `badges.${number}.tokenId`}
                    control={control}
                    // defaultValue={field.tokenId}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min="1" />
                    )}
                  />
                  <Error error={errors.badges?.[index]?.tokenId?.message} />
                </Field>
                <Field>
                  <Label size="sm">Min</Label>
                  <Controller
                    name={`badges[${index}].minBadgeBalance` as `badges.${number}.minBadgeBalance`}
                    control={control}
                    defaultValue={field.minBadgeBalance}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min="1" />
                    )}
                  />
                  <Error error={errors.badges?.[index]?.minBadgeBalance?.message} />
                </Field>
                <Field>
                  <Label size="sm">Max</Label>
                  <Controller
                    name={`badges[${index}].maxBadgeBalance` as `badges.${number}.maxBadgeBalance`}
                    control={control}
                    defaultValue={field.maxBadgeBalance}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min="1" />
                    )}
                  />
                  <Error error={errors.badges?.[index]?.maxBadgeBalance?.message} />
                </Field>
                <button className="mt-8" type="button" onClick={() => remove(index)}>
                  <img className="h-[24px] w-[24px]" src="/img/remove.svg" alt="" />
                </button>
              </section>
            </div>
          ))}

          {formData.gatingType !== "Anyone" && (
            <section>
              <button
                className="text-blue-500"
                type="button"
                onClick={() =>
                  append({
                    contractAddress: "" as EvmAddress,
                    tokenId: 1,
                    minBadgeBalance: 1,
                    maxBadgeBalance: undefined,
                  })
                }
              >
                + Add Badge
              </button>
            </section>
          )}
        </form>
      </div>
      <FormProgress percent={80} onGoBack={onGoBack} onNext={handleSubmit(onNext)} cancelLink={"/app/analyze"} />
    </div>
  );
}

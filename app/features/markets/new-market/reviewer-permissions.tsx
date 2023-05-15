import { zodResolver } from "@hookform/resolvers/zod";
import * as Progress from "@radix-ui/react-progress";
import { useNavigate } from "@remix-run/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Container, Error, Field, Input, Label, Select } from "~/components";
import type { EvmAddress } from "~/domain/address";
import type { GatingData } from "~/domain/labor-market/schemas";
import { gatingSchema } from "~/domain/labor-market/schemas";

export function ReviewerPermissions({
  currentData,
  onDataUpdate,
}: {
  currentData: GatingData | null;
  onDataUpdate: (values: GatingData) => void;
}) {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<GatingData>({
    defaultValues: {
      ...currentData,
    },
    resolver: zodResolver(gatingSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "badges",
  });

  const navigate = useNavigate();
  const formData = watch();

  const onSubmit = (values: GatingData) => {
    console.log(values);
    onDataUpdate(values);
    navigate(`/app/market/new2/review`);
  };

  const onGoBack = () => {
    console.log(formData);
    onDataUpdate(formData);
    navigate(`/app/market/new2/analyst-permissions`);
  };

  return (
    <div className="relative min-h-screen">
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-9 max-w-4xl mx-auto">
        <Container className="py-16">
          <div className="max-w-2xl mx-auto">
            <section className="space-y-1">
              <h1 className="text-3xl font-semibold antialiased">Reviewer Permissions</h1>
              <p className="text-cyan-500 text-lg">
                Define who has permission to review and score submissions on challenges in this Marketplace. Reviewers
                enforce and elevate quality work from Analysts.
              </p>
            </section>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 py-5">
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
                        type: "Badge",
                        contractAddress: "" as EvmAddress,
                        tokenId: "",
                        minBadgeBalance: 1,
                        maxBadgeBalance: undefined,
                      })
                    }
                  >
                    + Add Badge
                  </button>
                </section>
              )}

              <div className="absolute bottom-0 left-0 right-0 w-full bg-transparent">
                <Progress.Root
                  value={1}
                  max={5}
                  style={{ height: 1, backgroundColor: "#EDEDED" }}
                  className="mx-auto w-full"
                >
                  <Progress.Indicator className="h-1 bg-blue-500" style={{ width: "80%" }} />
                </Progress.Root>
                <div className="max-w-4xl mx-auto py-4 px-6 flex flex-row gap-4 justify-start">
                  <button onClick={onGoBack} type="button" className="text-lg text-[#333333]">
                    <div className="flex flex-row gap-2 items-center">
                      <img src="/img/left-arrow.svg" alt="" />
                      <span> Prev </span>
                    </div>
                  </button>
                  <button className="text-lg text-[#333333]" type="submit">
                    <div className="flex flex-row gap-2 items-center">
                      <span> Next </span>
                      <img src="/img/right-arrow.svg" alt="" className="" />
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Container>
        <FormSteps />
      </section>
    </div>
  );
}

function FormSteps() {
  return (
    <aside className="py-28 md:w-1/5 hidden md:block">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-[#666666] font-bold text-sm">1</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-[#666666] font-bold text-sm">2</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-[#666666] font-bold text-sm">3</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
            <span className="text-white font-bold text-sm">4</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-[#666666] font-bold text-sm">5</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

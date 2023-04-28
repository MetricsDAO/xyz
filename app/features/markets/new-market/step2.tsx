import { zodResolver } from "@hookform/resolvers/zod";
import * as Progress from "@radix-ui/react-progress";
import { useNavigate } from "@remix-run/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Container, Error, Field, Input, Label, Select } from "~/components";
import type { EvmAddress } from "~/domain/address";
import type { step2Data } from "~/domain/labor-market/schemas";
import { step2Schema } from "~/domain/labor-market/schemas";

export function Step2({
  currentData,
  onDataUpdate,
}: {
  currentData: step2Data | null;
  onDataUpdate: (values: step2Data) => void;
}) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<step2Data>({
    defaultValues: {
      ...currentData,
    },
    resolver: zodResolver(step2Schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "badges",
  });

  const navigate = useNavigate();
  const formData = watch();

  const onSubmit = (values: step2Data) => {
    console.log(values);
    onDataUpdate(values);
    navigate(`/app/market/new2/step3`);
  };

  const onGoBack = () => {
    console.log(formData);
    onDataUpdate(formData);
    navigate(`/app/market/new2`);
  };

  const handleAddBadge = () => {
    append({
      type: "Badge",
      contractAddress: "" as EvmAddress,
      tokenId: "",
      minBadgeBalance: 1,
      maxBadgeBalance: undefined,
    });
  };

  return (
    <div className="relative min-h-screen">
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-9 max-w-4xl mx-auto">
        <Container className="py-16">
          <div className="max-w-2xl mx-auto">
            <section className="space-y-1">
              <h1 className="text-3xl font-semibold antialiased">Sponsor Permissions</h1>
              <p className="text-cyan-500 text-lg">
                Define who has permission to launch challenges in this Marketplace. Sponsors launch time-bound
                challenges and fund tokens to reward Analysts.
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
                  <section className="grid grid-cols-1 align-center md:grid-cols-5 gap-6">
                    {/* <Field>
                  <Label size="sm">Type</Label>
                  <Controller
                    name={`sponsorBadges[${index}].type` as keyof step2Data}
                    control={control}
                    render={({ field }) => <Select {...field} options={[{ label: "Badge", value: "Badge" }]} />}
                  />
                </Field> */}
                    <Field>
                      <Label size="sm">Contract Address</Label>
                      <Controller
                        name={`badges[${index}].contractAddress` as keyof step2Data}
                        control={control}
                        // defaultValue="0x0000000000000000000000000000000000000000"
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} onBlur={onBlur} ref={ref} type="text" />
                        )}
                      />
                      <Error error={errors.badges?.[index]?.contractAddress?.message} />
                    </Field>
                    <Field>
                      <Label size="sm">token ID</Label>
                      <Controller
                        name={`badges[${index}].tokenId` as keyof step2Data}
                        control={control}
                        // defaultValue={field.tokenId}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                      <Error error={errors.badges?.[index]?.tokenId?.message} />
                    </Field>
                    <Field>
                      <Label size="sm">Min</Label>
                      <Controller
                        name={`badges[${index}].minBadgeBalance` as keyof step2Data}
                        control={control}
                        defaultValue={field.minBadgeBalance}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                      <Error error={errors.badges?.[index]?.minBadgeBalance?.message} />
                    </Field>
                    <Field>
                      <Label size="sm">Max</Label>
                      <Controller
                        name={`badges[${index}].maxBadgeBalance` as keyof step2Data}
                        control={control}
                        defaultValue={field.maxBadgeBalance}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                      <Error error={errors.badges?.[index]?.maxBadgeBalance?.message} />
                    </Field>
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </section>
                </div>
              ))}

              {formData.gatingType !== "Anyone" && (
                <section>
                  <button className="text-blue-500" type="button" onClick={handleAddBadge}>
                    + Add Type
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
                  <Progress.Indicator className="h-1 bg-blue-500" style={{ width: "40%" }} />
                </Progress.Root>
                <div className="max-w-4xl text-lg mx-auto py-4 gap-6 flex justify-start">
                  <button onClick={onGoBack} type="button">
                    Back
                  </button>
                  <button type="submit">Next</button>
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
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
            <span className="text-white font-bold text-sm">2</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-[#666666] font-bold text-sm">3</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-[#666666] font-bold text-sm">4</span>
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

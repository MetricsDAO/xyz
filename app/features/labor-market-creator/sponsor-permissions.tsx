import { ArrowLeftCircleIcon, ArrowRightCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@remix-run/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button, Error, Field, Input, Label, Progress, Select } from "~/components";
import FormStepper from "~/components/form-stepper/form-stepper";
import type { EvmAddress } from "~/domain/address";
import type { GatingData } from "~/domain/labor-market/schemas";
import { gatingSchema } from "~/domain/labor-market/schemas";

export function SponsorPermissions({
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
    navigate(`/app/market/new/analyst-permissions`);
  };

  const onGoBack = () => {
    console.log(formData);
    onDataUpdate(formData);
    navigate(`/app/market/new`);
  };

  const handleAddBadge = () => {
    append({
      contractAddress: "" as EvmAddress,
      tokenId: 1,
      minBadgeBalance: 1,
      maxBadgeBalance: undefined,
    });
  };

  return (
    <div className="flex relative min-h-screen">
      <div className="w-full justify-between flex flex-col">
        <div className="max-w-2xl mx-auto my-16 space-y-10">
          <section className="space-y-1">
            <h1 className="text-3xl font-semibold antialiased">Sponsor Permissions</h1>
            <p className="text-cyan-500 text-lg">
              Define who has permission to launch challenges in this Marketplace. Sponsors launch time-bound challenges
              and fund tokens to reward Analysts.
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
                        <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
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
                        <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                      )}
                    />
                    <Error error={errors.badges?.[index]?.minBadgeBalance?.message} />
                  </Field>
                  <Field>
                    <Label size="sm">Max</Label>
                    <div className="flex flex-row items-center gap-4">
                      <Controller
                        name={`badges[${index}].maxBadgeBalance` as `badges.${number}.maxBadgeBalance`}
                        control={control}
                        defaultValue={field.maxBadgeBalance}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                    </div>
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
                <button className="text-blue-500" type="button" onClick={handleAddBadge}>
                  + Add Badge
                </button>
              </section>
            )}
          </form>
        </div>
        <div className=" w-full">
          <Progress progress={40} />
          <div className="flex items-center justify-evenly">
            <div className="flex items-center">
              <div className="flex gap-3 items-center cursor-pointer" onClick={onGoBack}>
                <ArrowLeftCircleIcon className="h-8 w-8 text-black" />
                <p className="mr-6">Prev</p>
              </div>
              <button className="flex gap-3 items-center cursor-pointer" onClick={handleSubmit(onSubmit)}>
                <p>Next</p>
                <ArrowRightCircleIcon className="h-8 w-8 text-black" />
              </button>
            </div>
            <div className="flex items-center">
              <Button className="my-5 mr-4" variant="cancel">
                <Link to={`/analyze`}>Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper
          step={2}
          labels={["Create", "Sponsor Permissions", "Author Permissions", "Reviewer Permissios", "Overview"]}
        />
        <div className="flex mt-16 gap-x-2 items-center">
          <InformationCircleIcon className="h-6 w-6 mr-2" />
          <Link to={"https://www.trybadger.com/"} className="text-sm text-blue-600">
            Launch Badger
          </Link>
          <p className="text-sm text-blue-600">|</p>
          <Link to={"https://docs.trybadger.com/"} className="text-sm text-blue-600">
            Badger Docs
          </Link>
        </div>
      </aside>
    </div>
  );
}

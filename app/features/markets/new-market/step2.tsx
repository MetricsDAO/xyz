import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Combobox, Container, Field, Label, Select, Error, Input } from "~/components";
import { Button } from "~/components/button";
import type { step2Data } from "~/domain/labor-market/schemas";
import { step2Schema } from "~/domain/labor-market/schemas";
import { step1Schema } from "~/domain/labor-market/schemas";

export function Step2({
  onDataUpdate,
  onNextPage,
  onGoBack,
}: {
  onDataUpdate: (values: step2Data) => void;
  onNextPage: () => void;
  onGoBack: () => void;
}) {
  // const [step1Data, setStep1Data] = useState<step1Data | null>(null);

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<step2Data>({
    defaultValues: {
      gatingType: "Anyone",
      numberBadgesRequired: 1,
      sponsorBadges: [
        {
          type: "Badge",
          contractAddress: "0x0000000000000000000000000000000000000000",
          tokenId: "",
          minBadgeBalance: 1,
          maxBadgeBalance: undefined,
        },
      ],
    },
    resolver: zodResolver(step2Schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sponsorBadges",
  });

  const onSubmit = (values: step2Data) => {
    console.log(values);
    onDataUpdate(values);
    onNextPage();
  };

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
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
            </Field>
            <Field>
              <Input type="number" {...register("numberBadgesRequired")} />
            </Field>
            <div> of the following criteria needs to be met </div>
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
                    name={`sponsorBadges[${index}].contractAddress` as keyof step2Data}
                    control={control}
                    // defaultValue="0x0000000000000000000000000000000000000000"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} onBlur={onBlur} ref={ref} type="text" />
                    )}
                  />
                </Field>
                <Field>
                  <Label size="sm">token ID</Label>
                  <Controller
                    name={`sponsorBadges[${index}].tokenId` as keyof step2Data}
                    control={control}
                    // defaultValue={field.tokenId}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} onBlur={onBlur} ref={ref} type="number" min="1" />
                    )}
                  />
                </Field>
                <Field>
                  <Label size="sm">Min</Label>
                  <Controller
                    name={`sponsorBadges[${index}].minBadgeBalance` as keyof step2Data}
                    control={control}
                    defaultValue={field.minBadgeBalance}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} onBlur={onBlur} ref={ref} type="number" min="1" />
                    )}
                  />
                </Field>
                <Field>
                  <Label size="sm">Max</Label>
                  <Controller
                    name={`sponsorBadges[${index}].maxBadgeBalance` as keyof step2Data}
                    control={control}
                    defaultValue={field.maxBadgeBalance}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} onBlur={onBlur} ref={ref} type="number" min="1" />
                    )}
                  />
                </Field>
                <button type="button" onClick={() => remove(index)}>
                  Remove
                </button>
              </section>
            </div>
          ))}
          <section>
            <Button
              type="button"
              onClick={() =>
                append({
                  type: "Badge",
                  contractAddress: "0x0000000000000000000000000000000000000000",
                  tokenId: "",
                  minBadgeBalance: 1,
                  maxBadgeBalance: undefined,
                })
              }
            >
              Add New Badge
            </Button>
          </section>

          <Button size="lg" onClick={onGoBack} type="button">
            Back
          </Button>
          <Button size="lg" type="submit">
            Next
          </Button>
        </form>
      </div>
    </Container>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormProgress } from "~/components";
import { GatingFormFields } from "./gating-form-fields";
import type { GatingData } from "./schema";
import { GatingSchema } from "./schema";

export function AnalystPermissionsForm({
  defaultValues,
  onNext,
  onPrevious,
}: {
  defaultValues: GatingData | null;
  onNext: (values: GatingData) => void;
  onPrevious: (values: GatingData) => void;
}) {
  const methods = useForm<GatingData>({
    defaultValues: {
      ...defaultValues,
    },
    resolver: zodResolver(GatingSchema),
  });

  const formData = methods.watch();

  const onGoBack = () => {
    onPrevious(formData);
  };

  return (
    <div className="w-full justify-between flex flex-col">
      <div className="max-w-2xl mx-auto my-16 space-y-10">
        <section className="space-y-1">
          <h1 className="text-3xl font-semibold antialiased">Analyst Permissions</h1>
          <p className="text-cyan-500 text-lg">
            Define who has permission to enter submissions on challenges in this Marketplace. Analysts submit quality
            work to earn tokens from the reward pool.
          </p>
        </section>
        <FormProvider {...methods}>
          <GatingFormFields hint="Can submit challenges in this marketplace." />
        </FormProvider>
      </div>
      <FormProgress
        percent={60}
        onGoBack={onGoBack}
        onNext={methods.handleSubmit(onNext)}
        cancelLink={"/app/analyze"}
      />
    </div>
  );
}

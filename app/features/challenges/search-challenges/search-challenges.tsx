import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Combobox, Field, Input, Label, Select } from "~/components";
import type { ServiceRequestSearch } from "~/domain/service-request/schemas";
import { useProjects, useTokens } from "~/hooks/use-root-data";

type SearchChallengesProps = {
  defaultValues?: ServiceRequestSearch;
  onSubmit: (values: ServiceRequestSearch) => void;
};

export const SearchChallenges = React.forwardRef<HTMLFormElement, SearchChallengesProps>(
  ({ defaultValues, onSubmit }, ref) => {
    const tokens = useTokens();
    const projects = useProjects();

    const { register, control, handleSubmit, watch } = useForm<ServiceRequestSearch>({ defaultValues });

    useEffect(() => {
      const subscription = watch(() => handleSubmit(onSubmit)());
      return () => subscription.unsubscribe();
    }, [handleSubmit, onSubmit, watch]);

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 p-4 border border-gray-300/50 rounded-lg bg-blue-300 bg-opacity-5 text-sm"
      >
        <Input
          {...register("q")}
          type="search"
          placeholder="Search challenges"
          size="sm"
          iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
        />

        <Field>
          <Label>Sort:</Label>
          <Controller
            control={control}
            name="sortBy"
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select option"
                size="sm"
                options={[
                  { label: "New", value: "createdAtBlockTimestamp" },
                  { label: "Title", value: "appData.title" },
                  { label: "Submit Deadline", value: "configuration.submissionExpiration" },
                  { label: "Review Deadline", value: "configuration.enforcementExpiration" },
                ]}
              />
            )}
          />
        </Field>

        <Field>
          <Label>Reward Token</Label>
          <Controller
            control={control}
            name="token"
            render={({ field }) => (
              <Combobox {...field} options={tokens.map((t) => ({ value: t.symbol, label: t.name }))} />
            )}
          />
        </Field>

        <Field>
          <Label>Chain/Project</Label>
          <Controller
            control={control}
            name="project"
            render={({ field }) => (
              <Combobox {...field} options={projects.map((p) => ({ value: p.slug, label: p.name }))} />
            )}
          />
        </Field>
      </form>
    );
  }
);

SearchChallenges.displayName = "SearchChallenges";

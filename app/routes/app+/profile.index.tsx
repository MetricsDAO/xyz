import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Field, Label } from "~/components";
import { Combobox } from "~/components/combobox";
import { Container } from "~/components/container";
import { Input } from "~/components/input";
import { Pagination } from "~/components/pagination/pagination";
import type { ActivitySearch } from "~/domain";
import { ActivitySearchSchema, ActivityTypeSchema } from "~/domain";
import { searchUserActivity } from "~/domain/user-activity/function.server";
import { ActivityCards } from "~/features/my-activity/activity-card-mobile";
import type { ActivityDocWithMongoId } from "~/features/my-activity/activity-table-desktop";
import { ActivityTable } from "~/features/my-activity/activity-table-desktop";
import { connectToDatabase } from "~/services/mongo.server";
import { requireUser } from "~/services/session.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await requireUser(request, "/app/login?redirectto=app/profile");

  await connectToDatabase();

  const url = new URL(request.url);
  const activityTypes = Object.values(ActivityTypeSchema);
  const search = getParamsOrFail(url.searchParams, ActivitySearchSchema);
  const userActivities = await searchUserActivity(user.address, search);
  return typedjson({
    userActivities,
    activityTypes,
    user,
    search,
  });
};

export default function Profile() {
  const { userActivities, search } = useTypedLoaderData<typeof loader>();

  const submit = useSubmit();
  const searchRef = useRef<HTMLFormElement>(null);
  const onSearch = () => {
    submit(searchRef.current);
  };

  return (
    <Container className="py-16">
      <h2 className="text-lg font-semibold border-b border-gray-200 py-4 mb-6">
        Activity
        <span className="text-gray-400">{` (${userActivities.length})`}</span>
      </h2>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <ProfileListView activities={userActivities} />
            <div className="w-fit m-auto">
              <Pagination page={search.page} totalPages={Math.ceil(userActivities.length / search.first)} />
            </div>
          </div>
        </main>
        <aside className="md:w-1/4 lg:md-1/5">
          <SearchAndFilter ref={searchRef} onSubmit={onSearch} defaultValues={search} />
        </aside>
      </section>
    </Container>
  );
}

function ProfileListView({ activities }: { activities: ActivityDocWithMongoId[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex">
        <p className="text-gray-500 mx-auto py-12">Your activities will appear here!</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <ActivityTable activities={activities} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <ActivityCards activities={activities} />
      </div>
    </>
  );
}

type SearchActivitiesProps = {
  defaultValues?: ActivitySearch;
  onSubmit: (values: ActivitySearch) => void;
};

export const SearchAndFilter = React.forwardRef<HTMLFormElement, SearchActivitiesProps>(
  ({ defaultValues, onSubmit }, ref) => {
    const { register, control, handleSubmit, watch } = useForm<ActivitySearch>({ defaultValues });

    useEffect(() => {
      const subscription = watch(() => handleSubmit(onSubmit)());
      return () => subscription.unsubscribe();
    }, [handleSubmit, onSubmit, watch]);

    return (
      <form
        ref={ref}
        method="get"
        onChange={handleSubmit(onSubmit)}
        className="space-y-3 p-3 border-[1px] border-solid border-gray-100 rounded-md bg-blue-300 bg-opacity-5"
      >
        <Input
          {...register("q")}
          type="search"
          placeholder="Search Activities"
          size="sm"
          iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
        />
        <p className="text-lg font-semibold">Filter:</p>
        <Field>
          <Label>Type</Label>
          <Controller
            control={control}
            name="groupType"
            render={({ field }) => (
              <Combobox
                {...field}
                options={[
                  { label: "Marketplaces", value: "LaborMarket" },
                  { label: "Challenges", value: "ServiceRequest" },
                  { label: "Submissions", value: "Submission" },
                  { label: "Reviews", value: "Review" },
                ]}
              />
            )}
          />
        </Field>
      </form>
    );
  }
);

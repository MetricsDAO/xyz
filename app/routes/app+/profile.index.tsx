import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { Field, Label } from "~/components";
import { ValidatedCombobox } from "~/components/combobox";
import { Container } from "~/components/container";
import { ValidatedInput } from "~/components/input";
import { Pagination } from "~/components/pagination/pagination";
import { ActivityTypeSchema } from "~/domain";
import type { ActivityTypes } from "~/domain";
import { ActivitySearchSchema } from "~/domain";
import { searchUserActivity } from "~/domain/user-activity/function.server";
import { ActivityCards } from "~/features/my-activity/activity-card-mobile";
import type { ActivityDocWithMongoId } from "~/features/my-activity/activity-table-desktop";
import { ActivityTable } from "~/features/my-activity/activity-table-desktop";
import { getUser } from "~/services/session.server";

const validator = withZod(ActivitySearchSchema);

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await getUser(request);
  invariant(user, "Could not find user, please sign in");
  console.log("user", user);
  invariant(user.address, "Could not find user, please sign in");

  const url = new URL(request.url);
  const activityTypes = Object.values(ActivityTypeSchema);
  const search = getParamsOrFail(url.searchParams, ActivitySearchSchema);
  const userActivities = await searchUserActivity(user.address, search);
  console.log("userActivities", userActivities);
  return typedjson({
    userActivities,
    activityTypes,
    user,
    search,
  });
};

export default function Profile() {
  const { userActivities, search, activityTypes } = useTypedLoaderData<typeof loader>();

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
          <SearchAndFilter types={activityTypes} />
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

function SearchAndFilter({ types }: { types: ActivityTypes[] }) {
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = () => {
    if (formRef.current) {
      submit(formRef.current, { replace: true });
    }
  };
  return (
    <ValidatedForm
      formRef={formRef}
      method="get"
      validator={validator}
      onChange={handleChange}
      className="space-y-3 p-3 border-[1px] border-solid border-gray-100 rounded-md bg-blue-300 bg-opacity-5"
    >
      <ValidatedInput
        placeholder="Search"
        name="q"
        iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      />
      <p className="text-lg font-semibold">Filter:</p>
      <Field>
        <Label>Type</Label>
        <ValidatedCombobox
          name="eventType"
          size="sm"
          onChange={handleChange}
          placeholder="Select option"
          options={[{ label: "Marketplaces", value: "LaborMarketConfigured" }]}
        />
      </Field>
    </ValidatedForm>
  );
}

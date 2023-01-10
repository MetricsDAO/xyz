import { Outlet } from "@remix-run/react";
import type { ActionArgs, DataFunctionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import { Shell } from "~/features/shell";
import WelcomeModal, { validator } from "~/features/welcome-modal";
import { useOptionalUser } from "~/hooks/use-user";
import { userPrefs } from "~/utils/cookies";

const queryClient = new QueryClient();

export const loader = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  return typedjson({ hideTermsModal: !!cookie.hideTermsModal, redirectPath: url.pathname });
};

export const action = async ({ request }: ActionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  if (result.data.agreeToTerms) {
    cookie.hideTermsModal = true;
  }

  return redirect(result.data.redirectPath, {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
};

export default function Index() {
  const { hideTermsModal, redirectPath } = useTypedLoaderData<typeof loader>();
  const user = useOptionalUser();
  const showAgreeToTermsModal = !user && !hideTermsModal;
  return (
    <QueryClientProvider client={queryClient}>
      <Shell>
        <Outlet />
      </Shell>
      <WelcomeModal opened={showAgreeToTermsModal} redirectPath={redirectPath} />
    </QueryClientProvider>
  );
}

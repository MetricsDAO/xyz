import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Button, Modal } from "~/components";

export const validator = withZod(
  z.object({
    redirectPath: z.string(),
    agreeToTerms: z.enum(["true", "false"]).transform((v) => v === "true"),
  })
);

export default function WelcomeModal({ opened, redirectPath }: { opened: boolean; redirectPath: string }) {
  // force user to agree to terms
  const noop = () => {};
  return (
    <Modal isOpen={opened} onClose={noop} closeButton={false}>
      <div className="px-8">
        <img src="/img/mdao-purple-icon.png" alt="" className="mx-auto pb-5" />
        <h3 className="font-medium text-center">Welcome to the MetricsDAO ecosystem!</h3>
        <ul className="pb-10 pt-2 text-sm text-stone-500 list-disc list-outside pl-5">
          <li>You should not use the primary address you store assets in to connect to the app.</li>
          <li>
            This app is in beta and is subject to change and future code audits. See{" "}
            <a href="https://metricsdao.gitbook.io/metrics-app/" target="_blank" rel="noreferrer">
              <u className="text-blue-700">Docs</u>
            </a>{" "}
            for more.
          </li>
          <li>MetricsDAO will never ask you for your private keys or seed phrase.</li>
          <li>
            By clicking the button below you agree to our{" "}
            <a href="/terms" target="_blank">
              <u className="text-blue-700">Terms and Privacy</u>
            </a>
            .
          </li>
        </ul>
        <ValidatedForm validator={validator} action="/app" method="post">
          <input type="hidden" name="agreeToTerms" value="true" />
          <input type="hidden" name="redirectPath" value={redirectPath} />
          <Button type="submit" fullWidth={true}>
            Agree to Terms
          </Button>
        </ValidatedForm>
      </div>
    </Modal>
  );
}

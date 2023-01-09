import { Button, Modal } from "~/components";

export default function WelcomeModal({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: (value: React.SetStateAction<boolean>) => void;
}) {
  return (
    <Modal isOpen={opened} onClose={() => setOpened(false)}>
      <div className="px-8">
        <img src="/img/mdao-purple-icon.png" alt="" className="mx-auto pb-5" />
        <h3 className="font-medium text-center">Welcome to the MetricsDAO ecosystem!</h3>
        <ul className="pb-10 pt-2 text-sm text-stone-500 list-disc list-outside pl-5">
          <li>MetricsDAO will never ask you for your private keys or seed phrase.</li>
          <li>
            This app is in beta and is subject to change and future code audits. See{" "}
            <a href="https://docs.metricsdao.xyz/">
              <u className="text-blue-700">Docs</u>
            </a>{" "}
            for more.
          </li>
          <li>
            By clicking the button below you agree to our{" "}
            <a href="/terms">
              <u className="text-blue-700">Terms and Privacy</u>
            </a>
            .
          </li>
        </ul>
        <Button fullWidth={true} onClick={() => setOpened(false)}>
          Agree to Terms
        </Button>
      </div>
    </Modal>
  );
}

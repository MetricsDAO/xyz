import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="tw-flex tw-mx-6 tw-py-2 tw-border-b">
      <Link to="/" className="tw-no-underline tw-flex tw-mr-12 tw-items-center">
        <img src="/img/color-mark@2x.png" alt="MetricsDAO" width="24" height="24" className="tw-mr-2" />
        <p>
          Metrics<b>DAO</b>
        </p>
      </Link>
      <div className="tw-flex tw-space-x-7 tw-items-center">
        <Link to={"/app/route-one"} className="tw-no-underline">
          Route 1
        </Link>
        <Link to={"/app/route-two"} className="tw-no-underline">
          Route 2
        </Link>
      </div>
      <div className="tw-ml-auto">
        <ConnectButton />
      </div>
    </header>
  );
}

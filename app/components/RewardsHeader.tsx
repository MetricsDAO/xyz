import { Link } from "@remix-run/react";

import WalletConnector from "./WalletConnector";

export default function Header() {
  return (
    <header className="tw-max-w-screen-xl tw-flex tw-mx-auto tw-my-5 tw-items-center">
      <Link to="/" className="tw-no-underline">
        <img src="img/bw-lightbg@2x.png" alt="MetricsDAO" width="241" height="44" className="tw-mr-12" />
      </Link>
      <Link to="/question-generation" className="tw-no-underline">
        <p>Question Creation</p>
      </Link>
      <WalletConnector />
    </header>
  );
}

import { Link } from "@remix-run/react";

export default function AppHeader() {
  return (
    <header className="tw-flex tw-mx-6 tw-py-2 tw-border-b">
      <Link to="/" className="tw-no-underline tw-flex tw-mr-12 tw-items-center">
        <img src="/img/color-mark@2x.png" alt="MetricsDAO" width="24" height="24" className="tw-mr-2" />
        <p>
          Metrics<b>DAO</b>
        </p>
      </Link>
      <div className="tw-flex tw-space-x-7 tw-items-center">
        <Link to={"/questions"} className="tw-no-underline">
          <p>{"Questions"}</p>
        </Link>
      </div>
      <div className="tw-ml-auto">
        <button
          className={`tw-bg-white tw-border tw-px-5 tw-py-3 tw-max-w-xs tw-text-sm tw-rounded-lg tw-text-[#626262] `}
        >
          <div className="tw-flex tw-items-center tw-justify-center"> Connect Wallet</div>
        </button>
      </div>
    </header>
  );
}

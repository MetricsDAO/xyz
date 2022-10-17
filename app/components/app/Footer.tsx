import { Link } from "@remix-run/react";

export default function AppFooter() {
  return (
    <footer className="tw-bg-white tw-py-3">
      <div className="tw-flex tw-flex-col md:tw-flex-row">
        <div className="tw-basis-1/4 tw-flex tw-justify-center">
          <Logo />
        </div>
        <div className="tw-basis-1/2 tw-mt-4 md:tw-mt-0">
          <Links />
        </div>
        <div className="tw-basis-1/4 tw-mx-auto tw-mt-4 md:tw-mt-0 tw-flex tw-justify-center">
          <Socials />
        </div>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <Link to="/" className="tw-no-underline tw-flex tw-items-center tw-mx-auto">
      <img src="img/color-mark@2x.png" alt="MetricsDAO" width="24" height="24" className="tw-mx-auto tw-mr-2" />
      <p className="tw-hidden md:tw-block">
        Metrics<b>DAO</b>
      </p>
    </Link>
  );
}

function Links() {
  return (
    <div className="tw-grid tw-grid-cols-4 tw-items-center">
      <Link to="/dashboard" className="tw-no-underline tw-mx-auto">
        <p className="tw-font-semibold">Dashboard</p>
      </Link>
      <Link to="/showcase" className="tw-no-underline tw-mx-auto">
        <p className="tw-font-semibold">Showcase</p>
      </Link>
      <a href="https://metricsdao.ghost.io/" className="tw-no-underline tw-mx-auto">
        <p className="tw-font-semibold">Blog</p>
      </a>
      <Link to="/3-step-process" className="tw-no-underline tw-mx-auto">
        <p className="tw-font-semibold">Partners</p>
      </Link>
    </div>
  );
}

function Socials() {
  return (
    <div className="tw-flex tw-flex-row tw-mx-auto">
      <a href="https://twitter.com/MetricsDAO" className="tw-no-underline tw-mr-12">
        <img src="img/Twitter_icon_footer.svg" alt="Twitter" width="30" height="30" />
      </a>
      <a href="https://github.com/MetricsDAO" className="tw-no-underline tw-mr-12">
        <img src="img/Github_icon_footer.svg" alt="Github" width="30" height="30" />
      </a>
      <a href="https://discord.gg/p3GMjK2zAr" className="tw-no-underline">
        <img src="img/Discord_icon_footer.svg" alt="Discord" width="30" height="30" />
      </a>
    </div>
  );
}

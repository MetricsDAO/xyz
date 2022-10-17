import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "@remix-run/react";
import { Menu24 } from "@carbon/icons-react";

export default function Header() {
  return (
    <header className="tw-flex tw-mx-6 tw-py-2 tw-border-b">
      <Link to="/" className="tw-no-underline tw-flex md:tw-mr-12 tw-items-center">
        <img src="/img/color-mark@2x.png" alt="MetricsDAO" width="24" height="24" className="tw-mr-2" />
        <p className="tw-hidden md:tw-block">
          Metrics<b>DAO</b>
        </p>
      </Link>
      <div className="tw-flex tw-items-center">
        <div className="tw-block md:tw-hidden" id="mobile-menu">
          <MobileMenu />
        </div>
      </div>
      <div className="tw-flex tw-place-items-center">
        <div className="tw-hidden md:tw-block tw-mx-auto" id="desktop-menu">
          <WebsiteMenu />
        </div>
      </div>
      <div className="tw-ml-auto">
        <ConnectButton />
      </div>
    </header>
  );
}

function WebsiteMenu() {
  return (
    <div className="tw-flex tw-space-x-7 tw-items-center">
      <Link to={"/app/route-one"} className="tw-no-underline">
        Route 1
      </Link>
      <Link to={"/app/route-two"} className="tw-no-underline">
        Route 2
      </Link>
    </div>
  );
}

function MobileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="tw-bg-white tw-[#00C2FF] tw-flex tw-items-center tw-p-2">
          <Menu24 />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={5}
        className="tw-z-20 tw-w-max tw-mt-2 tw-p-3 tw-origin-top-right tw-bg-white tw-rounded-md tw-shadow-lg"
      >
        <DropdownMenuItem asChild>
          <Link to="/app/route-one" className="tw-block">
            Route 1
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={"/app/route-two"} className="tw-block">
            Route 2
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

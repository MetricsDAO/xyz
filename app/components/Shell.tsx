import { Menu24 } from "@carbon/icons-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NavLink } from "@remix-run/react";
import { Link } from "react-router-dom";
import { LogoMark, LogoType } from "./Logo";

const navitems = [
  { name: "Ecosystem", href: "/app/ecosystem" },
  { name: "Brainstorm", href: "/app/brainstorm" },
  { name: "Analyze", href: "/app/analyze" },
];

const userLinks = [{ name: "Reward Center", href: "/app/rewards" }];

// The Shell component is used to wrap the entire app. It's a good place to put things that should be on every page, like a header or footer.
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center space-x-4 px-4 h-16">
        <Link to="/" className="flex items-center space-x-3">
          <LogoMark /> <LogoType className="hidden md:block" />
        </Link>
        <nav className="flex-1 text-neutral-500">
          <div className="md:hidden">
            <MobileMenu />
          </div>
          <div className="hidden md:block">
            <DesktopMenu />
          </div>
        </nav>
        {/* <ConnectButton /> */}
        <ConnectButton.Custom>
          {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button onClick={openConnectModal} type="button">
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} type="button">
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: "flex", gap: 12 }}>
                      {/* <button onClick={openChainModal} style={{ display: "flex", alignItems: "center" }} type="button">
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button> */}

                      <button onClick={openAccountModal} type="button">
                        {/* {account.ensAvatar ? account.ensAvatar : account.} */}
                        {account.displayName}
                        {account.displayBalance ? ` (${account.displayBalance})` : ""}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </header>

      <main className="flex-1">{children}</main>

      <StatsBar />
    </div>
  );
}

function DesktopMenu() {
  return (
    <div className="flex px-2">
      <ul className="space-x-7 flex flex-1">
        {navitems.map((item) => (
          <NavLink key={item.name} to={item.href} className="flex items-center space-x-2">
            <span>{item.name}</span>
          </NavLink>
        ))}
      </ul>
      <Link to="/rewards">Reward Center</Link>
    </div>
  );
}

function MobileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center p-2">
          <Menu24 />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5} className="z-20 w-max mt-2 p-3 origin-top-right bg-white rounded-md border">
        {navitems.map((item) => (
          <DropdownMenuItem key={item.name} asChild>
            <Link to={item.href} className="flex items-center">
              <span>{item.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        {userLinks.map((item) => (
          <DropdownMenuItem key={item.name} asChild>
            <Link to={item.href} className="flex items-center">
              <span>{item.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatsBar() {
  return (
    <div className="flex flex-row w-full h-14 absolute bottom-0 bg-neutral-200 text-neutral-400 items-center justify-center">
      Stats Bar
    </div>
  );
}

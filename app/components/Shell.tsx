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
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import chainalysisAbi from "~/abi/chainalysis.json";
import { useAccount, useContractRead } from "wagmi";
import { useState } from "react";
import { logger } from "ethers";
import React from "react";

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
        <CustomConnectButton />
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

function CustomConnectButton() {
  const [connected, setConnected] = useState(false);

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      logger.info(address + "successfully connected");
      setConnected(true);
    },
  });

  const contract_address = "0x40c57923924b5c5c5455c48d93317139addac8fb";

  const { data } = useContractRead({
    address: contract_address,
    abi: chainalysisAbi.abi,
    functionName: "isSanctioned",
    args: [account.address],
    enabled: connected,
  });

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        if (data === true) {
          authenticationStatus = "unauthenticated";
        }

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
                  <button
                    className="btn rounded-md bg-gray-100 border py-1 px-2 bg-gradient-to-r from-[#67CCD3] to-[#C8D5A9]"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.name == "Ethereum") {
                return (
                  <button
                    className="btn rounded-md py-1 px-2 bg-red-600 text-white"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="btn rounded-md bg-gray-100 border p-[2px] bg-gradient-to-r from-[#67CCD3] to-[#C8D5A9]"
                    onClick={openAccountModal}
                    type="button"
                  >
                    <div className="flex gap-2 justify-between items-center h-full bg-white rounded-md px-4">
                      {account.ensAvatar ? (
                        account.ensAvatar
                      ) : (
                        <Jazzicon diameter={20} seed={jsNumberForAddress(account.address)} />
                      )}
                      {account.ensName ? account.ensName : account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ""}
                    </div>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
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

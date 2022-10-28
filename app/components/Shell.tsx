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

const userLinks = [{ name: "Rewards", href: "/app/rewards" }];

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
        <ConnectButton />
      </header>

      <main className="flex-1">{children}</main>

      {/* TODO: Not sticking to footer properly */}
      {/* <StatsBar /> */}
    </div>
  );
}

function DesktopMenu() {
  return (
    <div className="flex px-2">
      <ul className="space-x-7 flex flex-1 items-center">
        {navitems.map((item) => (
          <NavLink key={item.name} to={item.href} className="flex items-center space-x-2">
            {({ isActive }) => (
              <span className={isActive ? "border bg-gray-200 p-2 text-black rounded-lg" : ""}>{item.name}</span>
            )}
          </NavLink>
        ))}
      </ul>
      <NavLink key="RewardsCenter" to="/rewards" className="flex items-center space-x-2">
        {({ isActive }) => (
          <span className={isActive ? "border bg-gray-200 p-2 text-black rounded-lg" : ""}>Rewards Center</span>
        )}
      </NavLink>
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
            <NavLink key={item.name} to={item.href} className="flex items-center">
              {({ isActive }) => <span className={isActive ? "text-black" : ""}>{item.name}</span>}
            </NavLink>
          </DropdownMenuItem>
        ))}
        {userLinks.map((item) => (
          <DropdownMenuItem key={item.name} asChild>
            <NavLink key={item.name} to={item.href} className="flex items-center">
              {({ isActive }) => <span className={isActive ? "text-black" : ""}>{item.name}</span>}
            </NavLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* function StatsBar() {
  return (
    <div className="flex flex-row w-full h-14 absolute bottom-0 bg-neutral-200 text-neutral-400 items-center justify-center">
      Stats Bar
    </div>
  );
} */

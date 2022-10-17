import { Link } from "react-router-dom";
import { Button } from "./Button";
import { Logo } from "./Logo";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex items-center space-x-4 px-4 h-16">
        <Logo />
        <nav className="flex-1">
          <ul className="flex space-x-7 text-gray-400">
            <NavItem>
              <span>Trending</span>
            </NavItem>
            <NavItem>
              <span>Brainstorm</span>
            </NavItem>
            <NavItem>
              <span>Analyze</span>
            </NavItem>
            <NavItem>
              <span>Ecosystem</span>
            </NavItem>
          </ul>
        </nav>
        <Connection />
      </header>

      <main className="flex-1">{children}</main>

      <aside className="flex flex-row w-full">
        <Stat />
        <Stat />
        <Stat />
        <Stat />
      </aside>
    </div>
  );
}

function NavItem({ children }: { children: React.ReactNode }) {
  return <div className="flex space-x-2 items-center">{children}</div>;
}

function Connection() {
  return (
    <div className="flex space-x-6 whitespace-nowrap items-center">
      <Link to="/rewards">Reward Center</Link>
      <Button size="sm" fullWidth>
        Connect Wallet
      </Button>
    </div>
  );
}

function Stat() {
  return <div className="rounded-xl h-14 bg-neutral-200">stat</div>;
}

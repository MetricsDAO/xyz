import { Link } from "@remix-run/react";
import Avatar from "./Avatar";

/** Renders a wallet's avatar and address or ENS name, along with their rMETRIC balance, and UserCard on hover. */
export function Author() {
  // TODO: make a smaller variant
  return (
    <Link to="/u/id" className="flex rounded-full bg-zinc-200 items-center">
      <div className="flex rounded-full bg-zinc-100 h-8 pl-2 pr-3 items-center space-x-1">
        <Avatar size="md" alt="Joji.eth's avatar" />
        <span className="text-sm">Joji.eth</span>
      </div>
      <span className="pl-2 pr-3 text-xs text-zinc-500">400 rMETRIC</span>
    </Link>
  );
}

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Link, NavLink } from "@remix-run/react";
import clsx from "clsx";
import CustomConnectButton from "~/features/connect-button";
import { LogoMark, LogoType } from "./logo";
import { $path } from "remix-routes";
import { useOptionalUser } from "~/hooks/use-user";

const primaryLinks = [
  { link: $path("/app/ecosystem"), label: "Ecosystem" },
  { link: $path("/app/:type", { type: "brainstorm" }), label: "Brainstorm" },
  { link: $path("/app/:type", { type: "analyze" }), label: "Analyze" },
];

const userLinks = [
  {
    link: $path("/app/rewards"),
    label: (
      <span>
        Rewards <span className="bg-gray-400 rounded-md py-1 px-2 text-white">3</span>
      </span>
    ),
  },
];

export function AppHeader() {
  const user = useOptionalUser();
  const items = primaryLinks.map((link) => (
    <NavLink
      key={link.link}
      to={link.link}
      className={({ isActive }) =>
        clsx("block rounded-lg px-2 py-1.5", {
          "text-gray-400": !isActive,
          "text-gray-900 bg-gray-200 font-medium": isActive,
        })
      }
    >
      {link.label}
    </NavLink>
  ));

  const secondaryItems = userLinks.map((item) => (
    <NavLink
      key={item.link}
      to={item.link}
      className={({ isActive }) =>
        clsx("block rounded-lg px-2 py-1.5", { "text-gray-400": !isActive, "text-gray-900 bg-gray-200": isActive })
      }
    >
      {item.label}
    </NavLink>
  ));

  return (
    <header className="relative h-16 bg-white  ring-1 ring-black/5 flex items-center justify-between px-6 z-10">
      <div className="flex items-center">
        <Menu as="div" className="relative">
          <Menu.Button className="md:hidden">
            <Bars3Icon className="h-5 w-5" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-lg bg-white shadow-lg p-4 flex flex-col space-y-3 ring-1 ring-black ring-opacity-5">
              {items.concat(secondaryItems).map((item) => (
                <Menu.Item key={item.key}>{item}</Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
        <Link className="flex flex-row items-center gap-2" to="/">
          <LogoMark className="h-5 w-5" /> <LogoType className="hidden md:block" />
        </Link>
      </div>

      <menu className="hidden md:flex flex-row gap-4 ml-4">{items}</menu>

      <div className="flex items-center space-x-4">
        {user ? <div className="hidden md:block">{secondaryItems}</div> : null}
        <CustomConnectButton />
      </div>
    </header>
  );
}

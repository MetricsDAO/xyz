import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Link, NavLink } from "@remix-run/react";
import clsx from "clsx";
import CustomConnectButton from "./ConnectButton";
import { LogoMark, LogoType } from "./Logo";

const primaryLinks = [
  { link: "/app/ecosystem", label: "Ecosystem" },
  { link: "/app/brainstorm", label: "Brainstorm" },
  { link: "/app/analyze", label: "Analyze" },
];

const userLinks = [{ link: "/app/rewards", label: "Rewards" }];

export function AppHeader() {
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
    <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
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
        <div className="hidden md:block">{secondaryItems}</div>
        <CustomConnectButton />
      </div>
    </header>
  );
}

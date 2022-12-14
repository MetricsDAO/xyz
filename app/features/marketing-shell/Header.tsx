import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Link } from "@remix-run/react";

const links = [
  { link: "/protocol", label: "Protocol" },
  { link: "https://docs.metricsdao.xyz/", label: "Docs" },
  { link: "https://discourse.metricsdao.xyz/", label: "Governance" },
  { link: "https://blog.metricsdao.xyz/", label: "Blog" },
  { link: "/partner", label: "Partner with Us" },
];

export default function Header() {
  const items = links.map((link) => (
    <a key={link.link} href={link.link} className="block px-2 py-1.5 text-black">
      {link.label}
    </a>
  ));

  return (
    <header
      id="top"
      className="relative h-16 backdrop-blur-sm ring-1 ring-black/5 flex items-center justify-between px-6 z-10"
    >
      <div className="flex items-center space-x-4">
        <Menu as="div" className="relative">
          <Menu.Button className="md:hidden flex items-center">
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
              {items.map((item) => (
                <Menu.Item key={item.key}>{item}</Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
        <Link className="flex flex-row items-center gap-2" to="/">
          <img src="/img/black-mark@2x.png" alt="MetricsDAO" width="26" />
          <p>
            Metrics<b>DAO</b>
          </p>
        </Link>
      </div>

      <menu className="hidden md:flex flex-row gap-4 ml-4">{items}</menu>

      <a
        href="/app/ecosystem"
        target="_blank"
        className="bg-gradient-to-r to-green-300 from-sky-500 px-4 py-2 font-bold rounded-lg"
      >
        Launch App
      </a>
    </header>
  );
}

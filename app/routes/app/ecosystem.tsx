import { Container } from "~/components/container";
import { NavLink, Outlet } from "@remix-run/react";
import clsx from "clsx";

export default function Ecosystem() {
  return (
    <Container className="py-16 px-10">
      <section className="space-y-2 max-w-3xl mb-16">
        <h1 className="text-3xl font-semibold">Ecosystem</h1>
        <div>
          <p className="text-lg text-sky-500">
            Discover top submissions, rMETRIC holders, participants, and ecosystem metrics
          </p>
          <p className="text-gray-500 text-md">Quickly surface relevant challenge activity and metrics over time</p>
        </div>
        <div className="space-x-3 pt-5">
          <NavLink
            to="./"
            className={({ isActive }) =>
              clsx(
                isActive ? "bg-sky-500 text-white" : "border text-neutral-400 border-stone-500",
                "py-1.5 px-3 rounded-md"
              )
            }
          >
            Showcase
          </NavLink>
          <NavLink
            to="./metrics"
            className={({ isActive }) =>
              clsx(
                isActive ? "bg-sky-500 text-white" : "border text-neutral-400 border-stone-500",
                "py-1.5 px-3 rounded-md"
              )
            }
          >
            Metrics
          </NavLink>
        </div>
      </section>
      <Outlet />
    </Container>
  );
}

import { NavLink, useOutletContext } from "@remix-run/react";
import type { useState } from "react";
import { Button } from "~/components";

export type OutletContext = [number, (value: number) => void];

export default function Step2() {
  const [counter, setCounter] = useOutletContext<OutletContext>();
  return (
    <div>
      <p className="font-bold">Step 2</p>
      <Button onClick={() => setCounter((counter ?? 0) + 1)}>Increment</Button>
      <NavLink to="/app/market/new2">
        <Button>Step 1</Button>
      </NavLink>
    </div>
  );
}

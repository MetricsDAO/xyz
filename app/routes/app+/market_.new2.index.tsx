import { NavLink, useOutletContext } from "@remix-run/react";
import { Button } from "~/components";
import type { OutletContext } from "./market_.new2.step2";

export default function Step1() {
  const [counter, setCounter] = useOutletContext<OutletContext>();
  return (
    <div>
      <p className="font-bold">Step 1</p>
      <Button onClick={() => setCounter((counter ?? 0) + 1)}>Increment</Button>
      <NavLink to="/app/market/new2/step2">
        <Button>Step 2</Button>
      </NavLink>
    </div>
  );
}

import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.new2";

export default function Step2Page() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  return (
    <div>
      <p className="font-bold">Step 2</p>
    </div>
  );
}

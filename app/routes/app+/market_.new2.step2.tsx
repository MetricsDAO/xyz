import { useOutletContext } from "@remix-run/react";
import type { step2Data } from "~/domain/labor-market/schemas";
import { Step2 } from "~/features/markets/new-market/step2";
import type { OutletContext } from "./market_.new2";

export default function Step2Page() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  return (
    <div>
      <Step2
        currentData={formData.page2Data}
        onDataUpdate={(data: step2Data) => {
          setFormData((prevData) => ({ ...prevData, page2Data: data }));
        }}
      />
    </div>
  );
}

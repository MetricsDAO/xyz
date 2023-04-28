import { useOutletContext } from "@remix-run/react";
import type { step2Data } from "~/domain/labor-market/schemas";
import { Step4 } from "~/features/markets/new-market/step4";
import type { OutletContext } from "./market_.new2";

export default function Step3Page() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  return (
    <div>
      <Step4
        currentData={formData.page4Data}
        onDataUpdate={(data: step2Data) => {
          setFormData((prevData) => ({ ...prevData, page4Data: data }));
        }}
      />
    </div>
  );
}

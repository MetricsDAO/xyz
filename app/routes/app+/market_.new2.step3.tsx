import { useOutletContext } from "@remix-run/react";
import type { step2Data } from "~/domain/labor-market/schemas";
import { Step3 } from "~/features/markets/new-market/step3";
import type { OutletContext } from "./market_.new2";

export default function Step3Page() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  return (
    <div>
      <Step3
        currentData={formData.page3Data}
        onDataUpdate={(data: step2Data) => {
          setFormData((prevData) => ({ ...prevData, page3Data: data }));
        }}
      />
    </div>
  );
}

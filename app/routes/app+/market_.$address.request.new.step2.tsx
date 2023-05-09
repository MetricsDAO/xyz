import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "./market_.$address.request.new";
import { Step2Form } from "~/features/service-request-creator/schema";
import { Step2Fields } from "~/features/service-request-creator/step2-fields";

export default function Step2Page() {
  const [formData, setFormData] = useOutletContext<OutletContext>();
  console.log("formdata", formData);
  return (
    <div>
      <Step2Fields
        currentData={formData.page2Data}
        onDataUpdate={(data: Step2Form) => {
          setFormData((prevData) => ({ ...prevData, page2Data: data }));
        }}
      />
    </div>
  );
}

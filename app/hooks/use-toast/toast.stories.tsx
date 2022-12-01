import { Button } from "../../components/button";
import { Toaster } from "react-hot-toast";
import { WarningAltFilled20 } from "@carbon/icons-react";
import { useToast } from "./use-toast";

const BasicToast = () => {
  const handleCustom = () => {
    useToast(
      <div className="flex items-center">
        <WarningAltFilled20 />
        <p>Ope, something went wrong</p>
      </div>
    );
  };

  const handleString = () => {
    useToast("Here is your toast. I like toast. Do you like toast?");
  };

  return (
    <div className="space-x-2">
      <Button size="sm" variant="cancel" onClick={handleString}>
        String
      </Button>
      <Button size="sm" variant="cancel" onClick={handleCustom}>
        Custom
      </Button>
    </div>
  );
};

export const Basic = () => {
  return (
    <>
      <Toaster />
      <BasicToast />
    </>
  );
};

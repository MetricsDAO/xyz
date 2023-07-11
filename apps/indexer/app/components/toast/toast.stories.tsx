import { Button } from "../button";
import toast, { Toaster } from "react-hot-toast";
import { customToast } from "./toast";

const BasicToast = () => {
  const handleCustom = () => {
    customToast("Here is your toast. I like toast. Do you like toast?");
  };

  const handleSuccess = () => {
    toast.success("Yay");
  };

  const handleError = () => {
    toast.error("Oh no");
  };

  return (
    <div className="space-x-2">
      <Button size="sm" variant="cancel" onClick={handleSuccess}>
        Success
      </Button>
      <Button size="sm" variant="cancel" onClick={handleCustom}>
        Custom
      </Button>
      <Button size="sm" variant="cancel" onClick={handleError}>
        Error
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

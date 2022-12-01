import { Button } from "../button";
import toast, { Toaster } from "react-hot-toast";
import { Close20, WarningAltFilled20 } from "@carbon/icons-react";
import { Ope, Toast } from "./toast";

const BasicToast = () => {
  const handleInfo = () => {
    toast("Here is your toast.");
  };
  const handleWarning = () => {
    toast("Here is your toast.");
  };
  const handleSuccess = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        Ope
        <button onClick={() => toast.dismiss(t.id)} className="p-4 flex items-center justify-end">
          <Close20 />
        </button>
      </div>
    ));
  };

  const handleError = () => {
    Ope("Here is your toast.");
  };

  return (
    <div className="space-x-2">
      <Button size="sm" onClick={handleInfo}>
        Info
      </Button>
      <Button size="sm" onClick={handleWarning}>
        Warning
      </Button>
      <Button size="sm" onClick={handleError}>
        Error
      </Button>
      <Button size="sm" onClick={handleSuccess}>
        Success
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

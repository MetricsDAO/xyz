import { Button } from "../button";
import { ToastProvider, useToast } from "./toast";

export default {
  title: "Toast",
  component: ToastProvider,
};

const BasicToast = () => {
  const { addNotification } = useToast();

  const handleInfo = () => {
    addNotification({
      type: "info",
      title: "Information",
      description: "This is an info message!",
    });
  };
  const handleWarning = () => {
    addNotification({
      type: "warning",
      title: "This is a warning",
      description: "This is a warning message!",
    });
  };
  const handleSuccess = () => {
    addNotification({
      type: "success",
      title: "This is a Success",
      description: "This is a Success message!",
    });
  };

  const handleError = () => {
    addNotification({
      type: "error",
      title: "This is an Error",
      description: "This is an Error message!",
    });
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
    <ToastProvider>
      <BasicToast />
    </ToastProvider>
  );
};

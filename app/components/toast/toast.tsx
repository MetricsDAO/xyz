import toast, { ToastPosition } from "react-hot-toast";
import { Close20 } from "@carbon/icons-react";

type ToastProps = {
  position?: ToastPosition;
  children: React.ReactNode;
};

export function Ope(words: string) {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}
    >
      {words}
      <div className="flex">
        <button onClick={() => toast.dismiss(t.id)} className="w-full flex items-center justify-end">
          <Close20 />
        </button>
      </div>
    </div>
  ));
}

export const Toast = ({ position, children }: ToastProps) => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        {children}
        <button onClick={() => toast.dismiss(t.id)} className="w-full p-4 flex items-center justify-center">
          <Close20 />
        </button>
      </div>
    ),
    {
      position: position,
    }
  );
};

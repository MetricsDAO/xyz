import { XMarkIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";

const notifyTransactionWrite = ({ transactionHash }: { transactionHash?: string }) => {
  toast.loading(
    () => {
      return (
        <div>
          <div>Waiting on transaction...</div>
          <a
            className="text-blue-600"
            target="_blank"
            href={`https://polygonscan.com/tx/${transactionHash}`}
            rel="noreferrer"
          >
            View on polygonscan
          </a>
        </div>
      );
    },
    { id: "waiting-on-transaction" }
  );
};

const notifyTransactionSuccess = ({ transactionHash }: { transactionHash?: string }) => {
  toast.dismiss("waiting-on-transaction");
  toast.success(
    (t) => {
      return (
        <>
          <div>
            <div>Transaction Complete</div>
            <a
              className="text-blue-600"
              target="_blank"
              href={`https://polygonscan.com/tx/${transactionHash}`}
              rel="noreferrer"
            >
              View on polygonscan
            </a>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="flex items-center px-3">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </>
      );
    },
    {
      duration: 15000,
    }
  );
};

const notifyTransactionFailure = () => {
  toast.dismiss("waiting-on-transaction");
  toast.error("Transaction failed");
};

export default {
  notifyTransactionWrite,
  notifyTransactionSuccess,
  notifyTransactionFailure,
};

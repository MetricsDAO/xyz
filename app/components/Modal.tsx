import { Close32 } from "@carbon/icons-react";
import { Dialog, Transition } from "@headlessui/react";
import type { ReactElement } from "react";
import { Fragment } from "react";
import SelectWallet from "./SelectWallet";
export default function Modal({
  isOpen,
  close,
  children,
}: {
  isOpen: boolean;
  close: () => void;
  children?: ReactElement;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog className="tw-fixed tw-inset-0 tw-z-10 tw-overflow-y-auto" onClose={() => null}>
        <div className="tw-min-h-screen tw-px-0 tw-text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="tw-fixed tw-inset-0 tw-bg-[#262B33] tw-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="tw-inline-block tw-h-screen tw-align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="tw-my-8 tw-inline-block tw-w-full tw-max-w-md tw-transform tw-overflow-hidden tw-rounded-2xl tw-bg-white tw-p-6 tw-text-left tw-align-middle tw-shadow-xl tw-transition-all">
              <Close32 className="tw-relative tw-cursor-pointer tw-left-[90%]" onClick={() => close()} />
              <Dialog.Title as="h3" className="tw-mb-[20px] tw-mt-[25px] tw-text-center tw-text-lg tw-font-bold">
                Connect your wallet
              </Dialog.Title>
              <p className="tw-mb-[20px] tw-text-center">
                Connect the wallet you want to use to claim rewards in your wallet.
              </p>

              <SelectWallet />
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  unmount?: boolean;
  closeButton?: boolean;
}

// https://headlessui.com/react/dialog
export function Modal({ title, isOpen, onClose, children, unmount, closeButton = true }: ModalProps) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose} unmount>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-12 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="flex justify-between items-center text-xl font-medium leading-6 text-gray-900"
                  >
                    <h1>{title}</h1>
                    {closeButton ? (
                      <button onClick={onClose}>
                        <XMarkIcon className="h-7 w-7" />
                      </button>
                    ) : (
                      <></>
                    )}
                  </Dialog.Title>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

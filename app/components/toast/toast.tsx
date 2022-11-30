import * as Toast from "@radix-ui/react-toast";
import clsx from "clsx";
import { AnimatePresence, motion, usePresence } from "framer-motion";
import { nanoid } from "nanoid";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { WarningAltFilled20, CheckmarkFilled20, Close20, Information20 } from "@carbon/icons-react";

/*
 * -------------------------------------------------------------------------------------------------
 * Toast Provider
 * -------------------------------------------------------------------------------------------------
 * This is important for the functioning on the toast component. If it is used at the root, any children below it
 * will have access to the toast context and add toast notifications.
 *
 * Under the hood, it will render all the required toast components and provide the react tree with the context needed to add notifications
 */

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastContextProvider>
      {children}
      <ToastRoot />
    </ToastContextProvider>
  );
};

/*
 * -------------------------------------------------------------------------------------------------
 * useToast
 * -------------------------------------------------------------------------------------------------
 * For the end user, this is the main function of the toast component. After being imported in the app, just firing a addNotification will add a toast notification.
 */

/** This is a simple custom hook that can be consumed anywhere in the tree below the ToastProvider.
 * This is the key part of the Toast component that allows you to add and remove notifications.
 *
 * const {addNotification} = useToast();
 *
 * Then call:
 *
 *  addNotification({
 *    type: "success",
 *    message: "This is a toast notification",
 *    description: "This is a toast message"
 *  })
 *
 * That's it! You can add as many notifications as you want.
 */
const useToast = () => useContext(ToastContext);

/*
 * -------------------------------------------------------------------------------------------------
 * Toast Context
 * -------------------------------------------------------------------------------------------------
 * This Provides all the imperative code to provide toast state to any component under the react tree
 */

type ToastType = "success" | "warning" | "error" | "info";

export interface Notification {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  timeout?: number;
  preventClose?: boolean;
}

export type ToastMessage = Pick<Notification, "type" | "title" | "description">;

interface ToastContextState {
  notifications: Notification[];
  addNotification: (notification: ToastMessage) => void;
  removeNotification: (id: string) => void;
}

const ToastContext = createContext<ToastContextState>({} as ToastContextState);

interface ToastContextProps {
  children?: React.ReactNode;
}

/** this provider uses react context to provide any consuming components below it in the
tree access to the Toast state and its methods to add and remove items */
const ToastContextProvider = ({ children }: ToastContextProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add a toast
  const addNotification = useCallback(
    ({ type, title, description }: ToastMessage) => {
      const notificationData: Notification = {
        // Create a random id as a unique identifier for the notification
        id: nanoid(6),
        type,
        title,
        description,
      };
      setNotifications([notificationData, ...notifications]);
    },
    [notifications, setNotifications]
  );

  // remove a toast
  const removeNotification = useCallback(
    (id: string) => {
      const i = notifications.findIndex((item) => item.id === id);
      if (i === -1) return;
      setNotifications([...notifications.slice(0, i), ...notifications.slice(i + 1)]);
    },
    [notifications, setNotifications]
  );

  return (
    <ToastContext.Provider
      value={useMemo(
        () => ({ notifications, addNotification, removeNotification }),
        [addNotification, notifications, removeNotification]
      )}
    >
      {children}
    </ToastContext.Provider>
  );
};

/*
 * -------------------------------------------------------------------------------------------------
 * Toast Root
 * -------------------------------------------------------------------------------------------------
 * This is mainly an abstraction of the radix-ui toast component with a sprinkle of framer motion
 */

/** this is the component that wraps all the toast components together. It contains the toast viewport which enables the the toast items to be rendered.
 When an item is added to the toast state the Toast root will loops through the toast items and add them to the viewport */
export const ToastRoot = () => {
  const { notifications, removeNotification } = useToast();

  return (
    <Toast.Provider>
      <AnimatePresence>
        {notifications.map((notification) => (
          <Toast.Root
            asChild
            forceMount
            open
            onOpenChange={(open) => {
              if (!open) {
                removeNotification(notification.id);
              }
            }}
            duration={notification.timeout}
            key={notification.id}
          >
            <ToastItem notification={notification} removeNotification={removeNotification} />
          </Toast.Root>
        ))}
      </AnimatePresence>

      {/* this determines the position of the toast container */}
      <Toast.Viewport className="fixed bottom-8 right-8 z-20 flex flex-col" />
    </Toast.Provider>
  );
};

interface ToastItemProps {
  notification: Notification;
  removeNotification: (id: string) => void;
}

/*
 * -------------------------------------------------------------------------------------------------
 * ToastItem
 * -------------------------------------------------------------------------------------------------
 * This contains all the styles and markup of each individual toast item. This can all be controlled by toast state.
 */

/** This contains the markup, animation and styles for the individual Toast items */
const ToastItem = ({ notification, removeNotification }: ToastItemProps) => {
  const [isPresent, safeToRemove] = usePresence();

  const animations = {
    layout: true,
    initial: "out",
    animate: isPresent ? "in" : "out",
    whileTap: "tapped",
    variants: {
      in: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.1, ease: "easeOut" },
      },
      out: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.1, ease: "easeOut" },
      },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition: { duration: 0.2, ease: "easeOut" },
  };

  return (
    <motion.div
      className={clsx(
        "mt-4 flex w-96 items-start justify-between rounded-md p-4 shadow-lg bg-white border dark:bg-gray-80 dark:border-gray-700"
      )}
      {...animations}
    >
      <div>
        {notification.type === "info" ? (
          <Information20 className="h-6 w-6 text-blue-500" />
        ) : notification.type === "success" ? (
          <CheckmarkFilled20 className="h-6 w-6 text-green-600" />
        ) : notification.type === "warning" ? (
          <WarningAltFilled20 className="h-6 w-6 text-orange-600" />
        ) : notification.type === "error" ? (
          <WarningAltFilled20 className="h-6 w-6 text-red-600" />
        ) : (
          <div>...</div>
        )}
      </div>
      <div className="grow pl-2 pr-4 text-sm">
        <Toast.Title className="font-medium dark:text-gray-10">{notification.title}</Toast.Title>
        {notification.description && (
          <Toast.Description className="text-gray-60 dark:text-gray-40">{notification.description}</Toast.Description>
        )}
      </div>
      {!notification.preventClose && (
        <div className="h-10 items-center flex">
          <Close20
            className="h-5 w-5 opacity-90 transition hover:opacity-100 dark:text-gray-40 cursor-pointer"
            onClick={() => removeNotification(notification.id)}
          />
        </div>
      )}
    </motion.div>
  );
};

export { ToastProvider, useToast };

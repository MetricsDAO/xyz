import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

function TooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={5}
        className="bg-gray-200 text-black p-2 rounded-lg z-20"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-gray-200" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

const Provider = TooltipPrimitive.Provider;
const Root = TooltipPrimitive.Root;
const Trigger = TooltipPrimitive.Trigger;
const Content = TooltipContent;

type TooltipProps = {
  content: React.ReactNode;
  hide?: boolean;
  children: React.ReactNode;
};

export const Tooltip = ({ content, hide, children }: TooltipProps) => {
  if (hide) return <>{children}</>;

  return (
    <Provider delayDuration={0}>
      <Root>
        <Trigger asChild>
          <button>{children}</button>
        </Trigger>
        <Content>{content}</Content>
      </Root>
    </Provider>
  );
};

import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import React from "react";
import { Tooltip } from "~/components";
import { Button } from "~/components/button";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";

type Props = {
  link: LinkProps["to"];
  buttonText: string;
  disabled?: boolean;
  disabledTooltip?: string;
} & React.ComponentPropsWithoutRef<typeof Button>;

/**
 * A link that looks like a button. A user must be signed in to use it. Also handles disabling the button and showing a tooltip.
 */
export function WalletGuardedButtonLink({ link, buttonText, disabled, disabledTooltip, ...buttonProps }: Props) {
  return (
    <Tooltip content={disabledTooltip} hide={!disabledTooltip}>
      <ConnectWalletWrapper>
        <Button {...buttonProps} asChild={!disabled} disabled={disabled}>
          {!disabled ? <Link to={link}>{buttonText}</Link> : buttonText}
        </Button>
      </ConnectWalletWrapper>
    </Tooltip>
  );
}

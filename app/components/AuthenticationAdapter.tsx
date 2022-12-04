import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const response = await fetch("/api/nonce");
    const json = await response.json();
    console.log("nonce", json);
    return json;
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  },
  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },
  verify: async ({ message, signature }) => {
    const verifyRes = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, signature }),
    });
    const verified = Boolean(verifyRes.ok);

    return verified;
  },
  signOut: async () => {
    await fetch("/api/logout");
  },
});

import env from "~/env.server";

const SUBSCRIBER = "20231022";

export function pineConfig() {
  return {
    namespace: env.ENVIRONMENT === "development" ? "mdao-development" : "mdao-prod",
    subscriber: env.PINE_SUBSCRIBER_OVERRIDE ?? SUBSCRIBER,
    version: env.ENVIRONMENT === "development" ? "2.2.0" : "2.2.0",
  };
}

import env from "~/env.server";

const SUBSCRIBER = "20230406-3";

export function pineConfig() {
  return {
    namespace: env.ENVIRONMENT === "development" ? "mdao-development" : "mdao-prod",
    subscriber: env.PINE_SUBSCRIBER_OVERRIDE ?? SUBSCRIBER,
    version: "1.6.1",
  };
}

import env from "~/env.server";

const SUBSCRIBER = "20230616";

export function pineConfig() {
  return {
    namespace: env.ENVIRONMENT === "development" ? "mdao-development" : "mdao-prod",
    subscriber: env.PINE_SUBSCRIBER_OVERRIDE ?? SUBSCRIBER,
    version: "2.0.4",
  };
}

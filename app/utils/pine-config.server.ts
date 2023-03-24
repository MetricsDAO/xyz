import env from "~/env.server";

export function pineConfig() {
  return {
    namespace: env.ENVIRONMENT === "development" ? "mdao-development" : "mdao-prod",
    subscriber: "mar24",
    version: "1.6.1",
  };
}

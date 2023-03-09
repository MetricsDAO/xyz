import * as winston from "winston";
import { WinstonTransport as AxiomTransport } from "@axiomhq/axiom-node";

// https://github.com/axiomhq/axiom-node/blob/main/examples/winston.ts
const logger = winston.createLogger({
  level: "http",
  format: winston.format.json(),
  // uses environment variables `AXIOM_DATASET` and `AXIOM_TOKEN`
  transports: [
    new AxiomTransport(),
    new winston.transports.Console({
      format: winston.format.cli(),
      level: "debug",
    }),
  ],
});

// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.json(),
//     })
//   );
// }

export { logger };

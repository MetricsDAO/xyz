import { tracer as createTracer } from "@flipsidecrypto/pine-sdk";
import invariant from "tiny-invariant";

invariant(process.env.PINE_API_KEY, "PINE_API_KEY is required");
const PINE_API_KEY = process.env.PINE_API_KEY;

const tracer = createTracer({
  connection: {
    apikey: PINE_API_KEY,
    endpoint: "https://api.flipsidecrypto.com/api/v2",
  },
  tracer: {
    namespace: "labor-market",
    version: "0.0.1",
  },
});

const consumer = tracer.consume(
  async function (response) {
    console.log({ response });
    return false;
  },
  { name: "local", batchSize: 100 }
);

consumer.finally(() => process.exit(1));

import { tracer as createTracer } from "@flipsidecrypto/pine-sdk";

const tracer = createTracer({
  connection: {
    apikey: "your_api",
    endpoint: "https://api.flipsidecrypto.com/api/v2",
  },
  tracer: {
    namespace: "labor-market",
    version: "0.0.1",
  },
});

const consumer = tracer.consume(
  async function (response) {
    return true;
  },
  { name: "local", batchSize: 100 }
);

consumer.finally(() => process.exit(1));

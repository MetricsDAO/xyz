export interface TracerHandle {
  namespace: string;
  version: string;
}

export interface SubscriberHandle {
  tracer: TracerHandle;
  subscriber: string;
}

export type TracerCreateParams = {
  namespace: string;
  version: string;
  blockchain: {
    name: string;
    network: string;
  };
  contracts: {
    name: string;
    addresses: string[];
    schema: any;
  }[];
};

export interface EventsParams {
  limit?: number;
}

export interface EventsCommitParams {
  blockNumber: number;
  eventIndex: number;
}

export type TracerEvent = {
  storeIndex: number;
  txHash: string;
  contract: {
    name: string;
    address: string;
  };
  block: {
    number: number;
    timestamp: string;
  };
  decoded: {
    index: number;
    name: string;
    inputs: { name: string; value: string }[];
  };
  topics?: string[];
  data?: string;
};

export type SDKError = {
  // type?: ValueOf<typeof ERROR_TYPES> | "NETWORK_ERROR";
  name?: string;
  msg: string;
};

export type SDKResponse<DataType> =
  | {
      status: "ok";
      data: DataType;
      error: null;
    }
  | {
      status: "error";
      data: null;
      error: SDKError;
    };

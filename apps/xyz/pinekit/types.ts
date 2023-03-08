export interface TracerHandle {
  namespace: string;
  version: string;
}

export interface SubscriberHandle {
  tracer: TracerHandle;
  subscriber: string;
}

export interface TracerContract {
  name: string;
  addresses: string[];
  schema: any;
}

export interface TracerConfig {
  namespace: string;
  version: string;
  blockchain: {
    name: string;
    network: string;
  };
  contracts: TracerContract[];
}

export type TracerStateName = "TRACER_STATE_BACKFILL" | "TRACER_STATE_REALTIME";

export interface TracerState {
  id: string;
  state: TracerState;
  details: string | null;
  createdAt: string;
  updatedAt: string;
  tracerId: string;
}

export interface TracerDetails {
  id: string;
  namespace: string;
  version: string;
  config: TracerConfig;
  temporalWfId: string;
  blockchainId: string;
  userId: string;
  checkpointBlockNumber: number;
  createdAt: string;
  updatedAt: string;
  currentStateId: string;
  parentTracerId: string;
  currentState: TracerState;
  historicalState: TracerState[];
}

export interface EventsParams {
  limit?: number;
}

export interface EventsCommitParams {
  blockNumber: number;
  eventIndex: number;
}

export interface TracerEvent {
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
    inputs: Record<string, string>;
  };
  topics?: string[];
  data?: string;
}

export interface SDKError {
  // type?: ValueOf<typeof ERROR_TYPES> | "NETWORK_ERROR";
  name?: string;
  msg: string;
}

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

import type { PrepareWriteContractConfig, WriteContractPreparedArgs, WriteContractResult } from "wagmi/actions";
import { prepareWriteContract, writeContract } from "wagmi/actions";
import type { Signer } from "ethers";
import type { Abi } from "abitype";
import type { JsonObject } from "type-fest";
import { z } from "zod";
import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type ConfigWithoutCidFn = (ctx: { account: `0x${string}`; cid?: undefined }) => WriteContractPreparedArgs<any, any>;
type ConfigWithCidFn = (ctx: { account: `0x${string}`; cid: string }) => WriteContractPreparedArgs<any, any>;

type StartFn = (
  params: { config: ConfigWithCidFn; metadata: JsonObject } | { config: ConfigWithoutCidFn; metadata?: undefined }
) => void;

// https://github.com/wagmi-dev/wagmi/discussions/233#discussioncomment-2609115
export type EthersError = Error & { reason?: string; code?: string };

type State =
  | { state: "idle" }
  | { state: "preparing" }
  | { state: "failure"; error: string }
  | { state: "prepared"; prepared: WriteContractPreparedArgs<any, any> }
  | { state: "writing" }
  | { state: "written"; result: WriteContractResult }
  | { state: "waiting" }
  | { state: "success"; receipt: TransactionReceipt };

export type Transactor = ReturnType<typeof useTransactor>;

export function useTransactor({ onSuccess }: { onSuccess: (receipt: TransactionReceipt) => void }) {
  const account = useAccount();

  const [state, setState] = useState<State>({ state: "idle" });

  const start: StartFn = async (params) => {
    if (!account.address) throw new Error("Cannot write contract without an account.");

    setState({ state: "preparing" });
    let config: PrepareWriteContractConfig;
    if (params.metadata) {
      const uploaded = await uploadMetadata(params.metadata);
      config = params.config({ account: account.address, cid: uploaded.cid });
    } else {
      config = params.config({ account: account.address! });
    }
    try {
      const prepared = await prepareWriteContract(config);
      setState({ state: "prepared", prepared });
    } catch (e) {
      setState({ state: "failure", error: (e as EthersError)?.reason ?? "unknown error" });
    }
  };

  const write = async () => {
    if (state.state !== "prepared") throw new Error("Cannot write contract without being prepared.");
    setState({ state: "writing" });
    const result = await writeContract(state.prepared!);
    setState({ state: "waiting" });
    const receipt = await result.wait(1);
    setState({ state: "success", receipt });
  };

  const cancel = () => {
    setState({ state: "idle" });
  };

  useEffect(() => {
    if (state.state !== "success") return;
    onSuccess(state.receipt);
  }, [state, onSuccess]);

  return { start, write, cancel, ...state };
}

async function uploadMetadata(metadata: JsonObject) {
  const res = await fetch("/api/pin-to-ipfs", {
    body: JSON.stringify(metadata),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  return z.object({ cid: z.string() }).parse(json);
}

export function configureWrite<
  TAbi extends Abi,
  TFunctionName extends string,
  TChainId extends number,
  TSigner extends Signer = Signer
>(config: PrepareWriteContractConfig<TAbi, TFunctionName, TChainId, TSigner>) {
  return config as WriteContractPreparedArgs<TAbi, TFunctionName>;
}

import React from "react";
import type { ReactElement } from "react";

export default function NetworkRender({
    network, 
    chainName, 
    chainId, 
    switchNetwork,
    children
    }:{
    network: string,
    chainName?: string, 
    chainId?: number, 
    switchNetwork?: (chainId?:number) => void,
    children?: ReactElement
}) {
    function getContents() {
        if (network !== chainName?.toLowerCase()) {
            if (typeof(switchNetwork) === "function") {
                return (
                <div className={`tw-flex tw-flex-wrap tw-max-w-xs tw-text-sm tw-mx-auto ${children ? "tw-justify-center" : ""}`}>
                    <p className="tw-mb-2"> You are currently connected to {chainName}</p>
                    <button onClick={() => switchNetwork(chainId)} className="tw-bg-[#21C5F2] tw-px-5 tw-py-3 tw-text-sm tw-rounded-lg tw-text-white">switch network</button>
                </div>
                )
            } else {
                return (
                <div className={`tw-flex tw-flex-wrap tw-max-w-xs tw-text-sm tw-mx-auto ${children} ? "tw-justify-center" : ""`}>
                    <p className="tw-mb-2"> You are currently connected to {chainName}</p>
                    <p>Please switch wallet to {network} network</p>
                </div>
                )
            }
        } else {
            if (children) {
                return children;
            } else {
                return null;
            }
        }
    }
    return getContents();

}
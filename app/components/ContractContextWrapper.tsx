import { createContext } from "react";
import type { ReactElement } from "react";

export interface IContract {
    abi: string;
    address: string;
}

export interface IContractContext {
    contracts: Record<string, IContract>,
    network: string
}

// TODO: Improve the typings and init context
export const ContractContext = createContext<IContractContext>({
    contracts: {
        bountyQuestion: {address: "", abi: ""},
        questionAPI: {address: "", abi: ""},
        xmetric: {address: "", abi: ""},
        costController: {address: "", abi: ""},
        vault: {address: "", abi: ""},
        questionStateController: {address: "", abi: ""}
    }, 
    network: ""
});

export default function ContractContextWrapper({ 
    children,
    network,
    contracts
}: {
    children: ReactElement
    network: string
    contracts?: any
}) {
    return (
        <ContractContext.Provider value={{contracts: contracts, network: network}}>
            { children }
        </ContractContext.Provider>
    )
}
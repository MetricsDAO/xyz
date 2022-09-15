import { ContractTransaction, ContractInterface, BytesLike as Arrayish, BigNumber, BigNumberish } from "ethers";
import { EthersContractContextV5 } from "ethereum-abi-types-generator";

export type ContractContext = EthersContractContextV5<
  ActionCostController,
  ActionCostControllerMethodNames,
  ActionCostControllerEventsContext,
  ActionCostControllerEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type ActionCostControllerEvents = "OwnershipTransferred";
export interface ActionCostControllerEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter;
}
export type ActionCostControllerMethodNames =
  | "new"
  | "createCost"
  | "owner"
  | "payForCreateQuestion"
  | "payForVoting"
  | "questionApi"
  | "renounceOwnership"
  | "setCreateCost"
  | "setMetric"
  | "setQuestionApi"
  | "setVoteCost"
  | "transferOwnership"
  | "voteCost";
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface ActionCostController {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _metric Type: address, Indexed: false
   * @param _vault Type: address, Indexed: false
   */
  "new"(_metric: string, _vault: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  createCost(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _user Type: address, Indexed: false
   * @param questionId Type: uint256, Indexed: false
   */
  payForCreateQuestion(
    _user: string,
    questionId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param user Type: address, Indexed: false
   * @param questionId Type: uint256, Indexed: false
   */
  payForVoting(
    user: string,
    questionId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  questionApi(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _cost Type: uint256, Indexed: false
   */
  setCreateCost(_cost: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _metric Type: address, Indexed: false
   */
  setMetric(_metric: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newApi Type: address, Indexed: false
   */
  setQuestionApi(_newApi: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _cost Type: uint256, Indexed: false
   */
  setVoteCost(_cost: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(newOwner: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  voteCost(overrides?: ContractCallOverrides): Promise<BigNumber>;
}

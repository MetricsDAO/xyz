import { ContractTransaction, ContractInterface, BytesLike as Arrayish, BigNumber, BigNumberish } from "ethers";
import { EthersContractContextV5 } from "ethereum-abi-types-generator";

export type ContractContext = EthersContractContextV5<Vault, VaultMethodNames, VaultEventsContext, VaultEvents>;

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
export type VaultEvents = "OwnershipTransferred" | "Slashed" | "Withdraw";
export interface VaultEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter;
  Slashed(...parameters: any): EventFilter;
  Withdraw(...parameters: any): EventFilter;
}
export type VaultMethodNames =
  | "new"
  | "costController"
  | "depositsByWithdrawers"
  | "getAmountFromProperties"
  | "getLockedMetricByQuestion"
  | "getLockedPerUser"
  | "getMetricTotalLockedBalance"
  | "getUserFromProperties"
  | "getVaultById"
  | "getVaultsByWithdrawer"
  | "lockMetric"
  | "lockedMetric"
  | "lockedMetricByQuestion"
  | "metric"
  | "owner"
  | "questionStateController"
  | "renounceOwnership"
  | "setCostController"
  | "setMetric"
  | "setQuestionStateController"
  | "setTreasury"
  | "status"
  | "totalLockedInVaults"
  | "transferOwnership"
  | "treasury"
  | "withdrawMetric";
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface SlashedEventEmittedResponse {
  user: string;
  questionId: BigNumberish;
}
export interface WithdrawEventEmittedResponse {
  user: string;
  amount: BigNumberish;
}
export interface LockattributesResponse {
  user: string;
  0: string;
  amount: BigNumber;
  1: BigNumber;
  status: number;
  2: number;
}
export interface LockedMetricResponse {
  user: string;
  0: string;
  amount: BigNumber;
  1: BigNumber;
  status: number;
  2: number;
  length: 3;
}
export interface Vault {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param metricTokenAddress Type: address, Indexed: false
   * @param questionStateControllerAddress Type: address, Indexed: false
   * @param treasuryAddress Type: address, Indexed: false
   */
  "new"(
    metricTokenAddress: string,
    questionStateControllerAddress: string,
    treasuryAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  costController(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  depositsByWithdrawers(
    parameter0: string,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   * @param stage Type: uint256, Indexed: false
   * @param user Type: address, Indexed: false
   */
  getAmountFromProperties(
    questionId: BigNumberish,
    stage: BigNumberish,
    user: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   */
  getLockedMetricByQuestion(questionId: BigNumberish, overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _user Type: address, Indexed: false
   */
  getLockedPerUser(_user: string, overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMetricTotalLockedBalance(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   * @param stage Type: uint256, Indexed: false
   * @param user Type: address, Indexed: false
   */
  getUserFromProperties(
    questionId: BigNumberish,
    stage: BigNumberish,
    user: string,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   * @param stage Type: uint256, Indexed: false
   * @param user Type: address, Indexed: false
   */
  getVaultById(
    questionId: BigNumberish,
    stage: BigNumberish,
    user: string,
    overrides?: ContractCallOverrides
  ): Promise<LockattributesResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   */
  getVaultsByWithdrawer(user: string, overrides?: ContractCallOverrides): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param user Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param questionId Type: uint256, Indexed: false
   * @param stage Type: uint256, Indexed: false
   */
  lockMetric(
    user: string,
    amount: BigNumberish,
    questionId: BigNumberish,
    stage: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   * @param parameter2 Type: address, Indexed: false
   */
  lockedMetric(
    parameter0: BigNumberish,
    parameter1: BigNumberish,
    parameter2: string,
    overrides?: ContractCallOverrides
  ): Promise<LockedMetricResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  lockedMetricByQuestion(parameter0: BigNumberish, overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  metric(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  questionStateController(overrides?: ContractCallOverrides): Promise<string>;
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
   * @param _newCostController Type: address, Indexed: false
   */
  setCostController(_newCostController: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
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
   * @param _questionStateController Type: address, Indexed: false
   */
  setQuestionStateController(
    _questionStateController: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _treasury Type: address, Indexed: false
   */
  setTreasury(_treasury: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  status(overrides?: ContractCallOverrides): Promise<number>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  totalLockedInVaults(parameter0: string, overrides?: ContractCallOverrides): Promise<BigNumber>;
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
  treasury(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   * @param stage Type: uint256, Indexed: false
   */
  withdrawMetric(
    questionId: BigNumberish,
    stage: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}

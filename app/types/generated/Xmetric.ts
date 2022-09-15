import { ContractTransaction, ContractInterface, BytesLike as Arrayish, BigNumber, BigNumberish } from "ethers";
import { EthersContractContextV5 } from "ethereum-abi-types-generator";

export type ContractContext = EthersContractContextV5<Xmetric, XmetricMethodNames, XmetricEventsContext, XmetricEvents>;

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
export type XmetricEvents = "Approval" | "OwnershipTransferred" | "Paused" | "Transfer" | "Unpaused";
export interface XmetricEventsContext {
  Approval(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  Paused(...parameters: any): EventFilter;
  Transfer(...parameters: any): EventFilter;
  Unpaused(...parameters: any): EventFilter;
}
export type XmetricMethodNames =
  | "new"
  | "allowance"
  | "approve"
  | "balanceOf"
  | "burn"
  | "burnFrom"
  | "canTransact"
  | "decimals"
  | "decreaseAllowance"
  | "increaseAllowance"
  | "isTransactor"
  | "name"
  | "owner"
  | "pause"
  | "paused"
  | "renounceOwnership"
  | "setTransactor"
  | "symbol"
  | "totalSupply"
  | "transfer"
  | "transferFrom"
  | "transferOwnership"
  | "unPause";
export interface ApprovalEventEmittedResponse {
  owner: string;
  spender: string;
  value: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface PausedEventEmittedResponse {
  account: string;
}
export interface TransferEventEmittedResponse {
  from: string;
  to: string;
  value: BigNumberish;
}
export interface UnpausedEventEmittedResponse {
  account: string;
}
export interface Xmetric {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  "new"(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param owner Type: address, Indexed: false
   * @param spender Type: address, Indexed: false
   */
  allowance(owner: string, spender: string, overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   */
  balanceOf(account: string, overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param amount Type: uint256, Indexed: false
   */
  burn(amount: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  burnFrom(from: string, amount: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  canTransact(parameter0: string, overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  decimals(overrides?: ContractCallOverrides): Promise<number>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param subtractedValue Type: uint256, Indexed: false
   */
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param addedValue Type: uint256, Indexed: false
   */
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _addr Type: address, Indexed: false
   */
  isTransactor(_addr: string, overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(overrides?: ContractCallOverrides): Promise<string>;
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
   */
  pause(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  paused(overrides?: ContractCallOverrides): Promise<boolean>;
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
   * @param _transactor Type: address, Indexed: false
   * @param _isAllowed Type: bool, Indexed: false
   */
  setTransactor(
    _transactor: string,
    _isAllowed: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  transfer(to: string, amount: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  transferFrom(
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  unPause(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
}

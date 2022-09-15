import { ContractTransaction, ContractInterface, BytesLike as Arrayish, BigNumber, BigNumberish } from "ethers";
import { EthersContractContextV5 } from "ethereum-abi-types-generator";

export type ContractContext = EthersContractContextV5<
  QuestionStateController,
  QuestionStateControllerMethodNames,
  QuestionStateControllerEventsContext,
  QuestionStateControllerEvents
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
export type QuestionStateControllerEvents = "OwnershipTransferred";
export interface QuestionStateControllerEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter;
}
export type QuestionStateControllerMethodNames =
  | "getQuestionsByState"
  | "getState"
  | "getTotalVotes"
  | "getVoters"
  | "hasVoted"
  | "initializeQuestion"
  | "owner"
  | "publish"
  | "questionApi"
  | "questionByState"
  | "questionIndex"
  | "renounceOwnership"
  | "setDisqualifiedState"
  | "setQuestionApi"
  | "transferOwnership"
  | "unvoteFor"
  | "voteFor";
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface QuestionstatsResponse {
  questionId: BigNumber;
  0: BigNumber;
  uri: string;
  1: string;
  voters: string[];
  2: string[];
  totalVotes: BigNumber;
  3: BigNumber;
  questionState: number;
  4: number;
}
export interface QuestionByStateResponse {
  questionId: BigNumber;
  0: BigNumber;
  uri: string;
  1: string;
  totalVotes: BigNumber;
  2: BigNumber;
  questionState: number;
  3: number;
  length: 4;
}
export interface QuestionStateController {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param currentState Type: uint8, Indexed: false
   * @param currentQuestionId Type: uint256, Indexed: false
   * @param offset Type: uint256, Indexed: false
   */
  getQuestionsByState(
    currentState: BigNumberish,
    currentQuestionId: BigNumberish,
    offset: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<QuestionstatsResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   */
  getState(questionId: BigNumberish, overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   */
  getTotalVotes(questionId: BigNumberish, overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   */
  getVoters(questionId: BigNumberish, overrides?: ContractCallOverrides): Promise<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  hasVoted(parameter0: string, parameter1: BigNumberish, overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   * @param uri Type: string, Indexed: false
   */
  initializeQuestion(
    questionId: BigNumberish,
    uri: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * @param questionId Type: uint256, Indexed: false
   */
  publish(questionId: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  questionApi(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  questionByState(parameter0: BigNumberish, overrides?: ContractCallOverrides): Promise<QuestionByStateResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  questionIndex(parameter0: string, parameter1: BigNumberish, overrides?: ContractCallOverrides): Promise<BigNumber>;
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
   * @param questionId Type: uint256, Indexed: false
   */
  setDisqualifiedState(
    questionId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(newOwner: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _user Type: address, Indexed: false
   * @param questionId Type: uint256, Indexed: false
   */
  unvoteFor(
    _user: string,
    questionId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _user Type: address, Indexed: false
   * @param questionId Type: uint256, Indexed: false
   */
  voteFor(
    _user: string,
    questionId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}

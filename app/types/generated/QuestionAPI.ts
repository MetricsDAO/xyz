import { ContractTransaction, ContractInterface, BytesLike as Arrayish, BigNumber, BigNumberish } from "ethers";
import { EthersContractContextV5 } from "ethereum-abi-types-generator";

export type ContractContext = EthersContractContextV5<
  QuestionAPI,
  QuestionAPIMethodNames,
  QuestionAPIEventsContext,
  QuestionAPIEvents
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
export type QuestionAPIEvents =
  | "ChallengeCreated"
  | "OwnershipTransferred"
  | "QuestionAnswered"
  | "QuestionClaimed"
  | "QuestionCreated"
  | "QuestionDisqualified"
  | "QuestionPublished"
  | "QuestionUnvoted"
  | "QuestionUpvoted";
export interface QuestionAPIEventsContext {
  ChallengeCreated(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  QuestionAnswered(...parameters: any): EventFilter;
  QuestionClaimed(...parameters: any): EventFilter;
  QuestionCreated(...parameters: any): EventFilter;
  QuestionDisqualified(...parameters: any): EventFilter;
  QuestionPublished(...parameters: any): EventFilter;
  QuestionUnvoted(...parameters: any): EventFilter;
  QuestionUpvoted(...parameters: any): EventFilter;
}
export type QuestionAPIMethodNames =
  | "new"
  | "ADMIN_ROLE"
  | "PROGRAM_MANAGER_ROLE"
  | "addHolderRole"
  | "answerQuestion"
  | "claimQuestion"
  | "createChallenge"
  | "createQuestion"
  | "disqualifyQuestion"
  | "owner"
  | "publishQuestion"
  | "renounceOwnership"
  | "setClaimController"
  | "setCostController"
  | "setQuestionProxy"
  | "setQuestionStateController"
  | "toggleLock"
  | "transferOwnership"
  | "unvoteQuestion"
  | "upvoteQuestion";
export interface ChallengeCreatedEventEmittedResponse {
  questionId: BigNumberish;
  challengeCreator: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface QuestionAnsweredEventEmittedResponse {
  questionId: BigNumberish;
  answerer: string;
}
export interface QuestionClaimedEventEmittedResponse {
  questionId: BigNumberish;
  claimant: string;
}
export interface QuestionCreatedEventEmittedResponse {
  questionId: BigNumberish;
  creator: string;
}
export interface QuestionDisqualifiedEventEmittedResponse {
  questionId: BigNumberish;
  disqualifier: string;
}
export interface QuestionPublishedEventEmittedResponse {
  questionId: BigNumberish;
  publisher: string;
}
export interface QuestionUnvotedEventEmittedResponse {
  questionId: BigNumberish;
  voter: string;
}
export interface QuestionUpvotedEventEmittedResponse {
  questionId: BigNumberish;
  voter: string;
}
export interface QuestionAPI {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param bountyQuestion Type: address, Indexed: false
   * @param questionStateController Type: address, Indexed: false
   * @param claimController Type: address, Indexed: false
   * @param costController Type: address, Indexed: false
   */
  "new"(
    bountyQuestion: string,
    questionStateController: string,
    claimController: string,
    costController: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ADMIN_ROLE(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  PROGRAM_MANAGER_ROLE(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param nft Type: address, Indexed: false
   */
  addHolderRole(role: Arrayish, nft: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   * @param answerURL Type: string, Indexed: false
   */
  answerQuestion(
    questionId: BigNumberish,
    answerURL: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   */
  claimQuestion(questionId: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param uri Type: string, Indexed: false
   * @param claimLimit Type: uint256, Indexed: false
   */
  createChallenge(
    uri: string,
    claimLimit: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param uri Type: string, Indexed: false
   * @param claimLimit Type: uint256, Indexed: false
   */
  createQuestion(
    uri: string,
    claimLimit: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   */
  disqualifyQuestion(questionId: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
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
  publishQuestion(questionId: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
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
   * @param newQuestion Type: address, Indexed: false
   */
  setClaimController(newQuestion: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newCost Type: address, Indexed: false
   */
  setCostController(newCost: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newQuestion Type: address, Indexed: false
   */
  setQuestionProxy(newQuestion: string, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newQuestion Type: address, Indexed: false
   */
  setQuestionStateController(
    newQuestion: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  toggleLock(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
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
   * @param questionId Type: uint256, Indexed: false
   */
  unvoteQuestion(questionId: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param questionId Type: uint256, Indexed: false
   */
  upvoteQuestion(questionId: BigNumberish, overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
}

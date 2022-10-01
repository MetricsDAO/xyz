import type { BigNumber } from "ethers";

export interface TopChefAbi {
  inputs?: (InputsEntity | null)[] | null;
  stateMutability?: string | null;
  type: string;
  name?: string | null;
  anonymous?: boolean | null;
  outputs?: (OutputsEntity | null)[] | null;
}
export interface InputsEntity {
  internalType: string;
  name: string;
  type: string;
  indexed?: boolean | null;
}
export interface OutputsEntity {
  components?: InputsEntityOrOutputsEntityOrComponentsEntity[] | null;
  internalType: string;
  name: string;
  type: string;
}
export interface InputsEntityOrOutputsEntityOrComponentsEntity {
  internalType: string;
  name: string;
  type: string;
}

export interface QuestionData {
  name: string;
  program: string;
  description: string;
  url: string;
  questionId: number;
  totalVotes: number;
  date: string;
  loading: boolean | undefined;
  unavailable: boolean | undefined;
}

export interface ChainDataQuestion {
  questionId: BigNumber;
  questionState: number;
  totalVotes: BigNumber;
  uri: string;
  voters: string[];
}

export interface FCProps {
  className?: string;
}

export interface ContractEntity {
  abi: Record<string, string>[];
  address: string;
}

export interface ContractContextEntity {
  contracts: Record<string, ContractEntity>;
  network: string;
}

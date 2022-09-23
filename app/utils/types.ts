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
export type IpfsData = { date: number; name: string; description: string; program: string };
export interface QuestionData {
  questionId: number;
  uri: string;
  totalVotes: number;
  metadata: {
    isLoading: boolean;
    isError: boolean;
    data?: IpfsData;
  };
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

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
    components?: (InputsEntityOrOutputsEntityOrComponentsEntity)[] | null;
    internalType: string;
    name: string;
    type: string;
  }
  export interface InputsEntityOrOutputsEntityOrComponentsEntity {
    internalType: string;
    name: string;
    type: string;
  }
  
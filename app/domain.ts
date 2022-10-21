export type Address = string;

export const ProjectsAllowed = [
  { slug: "solana", name: "Solana" },
  { slug: "ethereum", name: "Ethereum" },
  { slug: "thor", name: "Thorchain" },
  { slug: "axelar", name: "Axelar" },
  { slug: "aave", name: "AAVE" },
];

// Enum for the different types of projects MDAO supports.
export type ProgramType = "brainstorm" | "community";

// A Program is a collection of Topics and related config.
export type Marketplace = {
  id: string;
  type: ProgramType;
  title: string;
  description: string;
  startsAt?: Date;
  endsAt?: Date;
  privacy: "public" | "private";
  creator: Address;
  authorRepMin: number;
  authorRepMax?: number;
  reviewerRepMin: number;
  reviewerRepMax?: number;
  rewardCurve: number;
  rewardTokens: string[];
  reviewMethod: "likert";
  reviewPriorityFactor: "cheap" | "normal" | "aggressive";
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  programId: string;
  payCurve: string;
  startsAt?: Date;
  endsAt?: Date;
  status: "pending" | "active" | "review" | "closed";
  sponsor: Address;
};

export type UnsavedTopic = Omit<Topic, "id">;

export type TopicWithMarketplace = Topic & { marketplace: Marketplace };

export type Submission = {
  id: string;
  author: Address;
};

export type LikertReview = {
  type: "likert";
  submissionId: string;
  reviewer: Address;
  score: number;
};

export type Review = LikertReview;

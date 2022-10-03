import AppHeader from "~/components/AppHeader";
import { Layout } from "~/components/AppLayout";
import DownloadCSV from "~/components/DownloadCSV";
import QuestionList from "~/components/QuestionList";
import { QuestionListControls } from "~/components/QuestionListControls";
import SearchInput from "~/components/SearchInput";
import WritingTips from "~/components/WritingTips";

export default function Index() {
  return (
    <>
      <AppHeader />
      <Layout>
        <Layout.LeftPanel>
          <QuestionListControls />
          <DownloadCSV questionData={QUESTION_DATA} />
        </Layout.LeftPanel>
        <Layout.Content>
          <SearchInput />
          <QuestionList questionData={QUESTION_DATA} />
        </Layout.Content>
        <Layout.RightPanel>
          <WritingTips />
        </Layout.RightPanel>
      </Layout>
    </>
  );
}

// Mock data for now
const QUESTION_DATA = [
  {
    name: "Crypto Kitties",
    program: "Flow",
    description: "Compare Crypto Kitties on Flow to Ethereum",
    url: "https://ipfs.io/ipfs/QmTvC9VVywVamrtwU1J4w5tHJvfTobapXnL7kiRfkmC8nJ",
    questionId: 2,
    totalVotes: 6,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "Tornado",
    program: "Ethereum",
    description: "Why was Tornado targeted by US treasury",
    url: "https://ipfs.io/ipfs/QmUD8BodHb2D3GtasenKGB5UrsmtKtMSDVELfSdH3F6DLc",
    questionId: 7,
    totalVotes: 4,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "FIrst inaugral question",
    program: "Ethereum",
    description: "Not really a question but a statement",
    url: "https://ipfs.io/ipfs/QmR5yvBNnd63u3e5RvRRHxiuumFwWp8DgPawdAW28rCWvg",
    questionId: 1,
    totalVotes: 4,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "Fifa World Cup",
    program: "Algorand",
    description: "Will the prices of Algorand Increase as we get closer to the World cup scheduled this winter 2022",
    url: "https://ipfs.io/ipfs/QmVEg19stcZssUBrwy5mKv4vTjU4bXk57ZL3wJc6qXZryf",
    questionId: 26,
    totalVotes: 3,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "Ethereum question again",
    program: "All",
    description: "why is ethereum doomed to fail",
    url: "https://ipfs.io/ipfs/QmZNqg9JSkGjypmvqCai9oCzpUaF2qD8hsJeMcXG6HGLAF",
    questionId: 11,
    totalVotes: 3,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "tornado",
    program: "All",
    description: "why tornado why not hurricane",
    url: "https://ipfs.io/ipfs/QmVW9YTbyyiVjh6F2KyJy97iXx2Dr7jS3qNZ5u1pZU3bob",
    questionId: 9,
    totalVotes: 3,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "Teesting more questions on blockchaine ",
    program: "Algorand",
    description: "What are people using ethereum instead of algorand",
    url: "https://ipfs.io/ipfs/QmfE8tgz7tdK4zJm2xpakfEEynGGyFuXAvLkXPE955he7h",
    questionId: 33,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "How much in cumulative fees does each NFT platform have?",
    program: "All",
    description:
      "How much has Opensea, LooksRare, X2Y2, and other marketplaces made in total off of their royalty share?",
    url: "Qmdn6TvaK9shRRjKX1joXedrhoJJ2H8mbeeWFgdYZ183GZ",
    questionId: 32,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    author: "0x1ccb2945F1325e061b40Fe5b0B452f0E76fB7278",
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "TEsting flow flow",
    program: "Flow",
    description: "This is just a test questions -- blah blah blah",
    url: "https://ipfs.io/ipfs/QmZL2Tti7oidqAinxnZvsH1eW8iFnicarcj5RWPfnwwSdp",
    questionId: 30,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    author: "0xa7Ed58695383f1504Afe2c0D4D4a3D39a911E4cC",
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "Demo for 9/7",
    program: "Ethereum",
    description: "How many people will remember to run a consensu client once the merge occurs",
    url: "https://ipfs.io/ipfs/QmZNyTr4y2oHiXNnH3BWkKvoScbbF2KUhNyjAoe2mxCC1q",
    questionId: 29,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    author: "0xF3dB86fde58d84b29a1EC2be27a8Fb087c436Ff3",
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "Reentrancy attacks on EVM chains",
    program: "All",
    description: "Explain the different Reentrancy attacks between mainnet, L2's and sidechains",
    url: "https://ipfs.io/ipfs/QmNWZxKcUmXfTZmRaHuxBPs6dCW3tGTYg3TrszP36vjZSZ",
    questionId: 28,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    author: "0xF3dB86fde58d84b29a1EC2be27a8Fb087c436Ff3",
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "Price of Ethereum",
    program: "Ethereum",
    description: "What will the price be in 3 weeks",
    url: "https://ipfs.io/ipfs/QmS5xTmwmnE7DpoZLv9WngPrThZj9iECRbiE5C68YdEXmf",
    questionId: 25,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "Flowing",
    program: "Flow",
    description: "maybe flume instead of flow",
    url: "https://ipfs.io/ipfs/QmRRExoWL5ymX74MyRpPrVHvSkvCo37pVgWhnfoHGzLaHx",
    questionId: 24,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "testing locally",
    program: "Ethereum",
    description: "It is - what it is",
    url: "https://ipfs.io/ipfs/QmcQg2qR2FedRfaV6BHzwRCeVzaVfBuScetxWsJvg5V1MB",
    questionId: 23,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "L2's Electric boogaloo",
    program: "Ethereum",
    description: "Test 8/26 - we testing it out",
    url: "https://ipfs.io/ipfs/QmTSf9kX8aSjkh5FjYQiDET53gkD8GCGmpHbn87fsXhh2i",
    questionId: 22,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "testing",
    program: "Flow",
    description: "is flow the new Ethereum",
    url: "https://ipfs.io/ipfs/QmbkEC7anw7rjRRz1Bd5ECZTNhYzUY9K5QQa2rcAwWsonP",
    questionId: 21,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
  {
    name: "Rune",
    program: "THORchain",
    description: "decentralizedliquiditynetwork expialidocious",
    url: "https://ipfs.io/ipfs/QmTMu6A4zEsCqhZUEtumPpU8nsqrRNZbvirqG2Zp98H8VA",
    questionId: 20,
    totalVotes: 2,
    date: new Date(1659728974224).toISOString(),
    loading: undefined,
    unavailable: undefined,
  },
];

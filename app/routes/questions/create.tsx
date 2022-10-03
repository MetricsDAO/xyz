import AppHeader from "~/components/AppHeader";
import { Layout } from "~/components/AppLayout";
import { CreateQuestion } from "~/components/CreateQuestion";
import WalletProvider from "~/components/WalletProvider";
import WritingTips from "~/components/WritingTips";

export default function CreateQuestionRoute() {
  const network = process.env.NETWORK || "localhost";

  return (
    <>
      <WalletProvider network={network}>
        <AppHeader />
      </WalletProvider>
      <Layout>
        <Layout.LeftPanel>{/* Nothing for now */}</Layout.LeftPanel>
        <Layout.Content>
          <CreateQuestion address={MOCK_ADDRESS} />
        </Layout.Content>
        <Layout.RightPanel>
          <WritingTips />
        </Layout.RightPanel>
      </Layout>
    </>
  );
}

// Mock data for now
const MOCK_ADDRESS = "0x1234567890123456789012345678901234567890";

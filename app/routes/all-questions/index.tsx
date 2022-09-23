import AllQuestionsContainer from "~/components/AllQuestionsContainer";
import WalletProvider from "~/components/WalletProvider";
import Header from "~/components/RewardsHeader";

export default function Index() {
  return (
    <WalletProvider>
      <Header />
      <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
        <AllQuestionsContainer />
      </section>
    </WalletProvider>
  );
}

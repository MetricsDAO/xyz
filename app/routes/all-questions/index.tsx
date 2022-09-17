import { useLoaderData } from "@remix-run/react";
import AllQuestionsContainer from "~/components/AllQuestionsContainer";
import WalletProvider from "~/components/WalletProvider";
import Wrapper from "~/components/Wrapper";

export async function loader() {
  return {
    primaryNetwork: process.env.NETWORK,
  };
}

export default function Index() {
  const { primaryNetwork } = useLoaderData();

  return (
    <WalletProvider network={primaryNetwork}>
      <>
        <Wrapper network={primaryNetwork} />
        <section className="tw-flex tw-flex-col tw-justify-center tw-bg-[#F3F5FA] tw-py-20">
          <AllQuestionsContainer primaryNetwork={primaryNetwork} />
        </section>
      </>
    </WalletProvider>
  );
}

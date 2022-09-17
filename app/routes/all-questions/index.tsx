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

  // This component structure is not great, but I think we need a rewrite of wrapper to facilitate
  // the ability to pass the wagmi hooks to children without suffering from floating unused props with cloning.
  // Possibly at the limit of my React knowledge here tho, so will need some input or time to research.
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

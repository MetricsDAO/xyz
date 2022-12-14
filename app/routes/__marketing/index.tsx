import MarketingButton from "~/components/marketing-button/marketing-button";
import SocialIcons from "~/features/marketing-shell/SocialIcons";

export default function Index() {
  return (
    <>
      <img src="/img/homepage-blur.png" className="absolute top-0 left-0 -z-10 h-screen w-screen" alt="" />
      <div className="px-16">
        <div className="space-y-5 pt-52 pb-36">
          <h1 className="font-bold text-8xl max-w-4xl">
            The <b className="text-white">DAO</b> for Web3 Data Analytics
          </h1>
          <p className="text-2xl max-w-lg">Connecting projects with the best analysts in Web3 for all data needs</p>
          <SocialIcons />
        </div>
        <img src="/img/homepage-blur.png" className="absolute top-100 left-0 -z-10 h-screen w-screen" alt="" />
        <div className="space-y-5 pt-24 pb-10 h-screen">
          <p className="text-white text-2xl">Our Mission</p>
          <p className="font-bold text-7xl max-w-5xl">
            Creating a fair and flexible <b className="text-white">analytics marketplace</b> to remove barriers to
            <b className="text-white"> on-chain participation</b> and help <b className="text-white">Web3</b>{" "}
            organizations launch, grow, and <b className="text-white">succeed.</b>
          </p>
          <MarketingButton label="Explore the Ecosystem" link="/app/ecosystem" variant="outline" />
        </div>
        <div className="grid grid-cols-2 gap-x-5 py-36">
          <div className="max-w-lg space-y-5">
            <h2 className="text-5xl font-bold">Providing on-demand data to power your organization</h2>
            <p className="text-stone-500 text-lg">
              To drive insights, data often needs to be analyzed through a series of complex and time-consuming
              processes. By partnering with MetricsDAO, organizations can tap the world’s best Web3 analyst community
              and streamline access to expert analytics work.
            </p>
            <MarketingButton label="Partner with us" link="/partner" />
          </div>
          <img src="/img/home-checkmark.png" alt="" className="mx-auto" />
        </div>
        <div className="grid grid-cols-2 gap-x-5 py-36">
          <img src="/img/home-results.png" alt="" />
          <div className="max-w-lg space-y-5">
            <h2 className="text-5xl font-bold">Rewarding the best analysts in Web3</h2>
            <p className="text-stone-500 text-lg">
              Analysts participate in challenges to earn partner reward tokens and rMETRIC while increasing their
              reputation in the ecosystem. Ongoing engagements that support partners’ goals also increase analysts’
              access to future earning opportunities.
            </p>
            <MarketingButton label="Learn about reputation & rMETRIC" link="" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5 py-36">
          <div className="max-w-lg space-y-5">
            <h2 className="text-5xl font-bold">Scaling on-demand analytics with a decentralized app</h2>
            <p className="text-stone-500 text-lg">
              Partners fund time-bound challenges where analysts compete to answer questions or solve problems. Winners
              earn tokens from the partner reward pool while increasing their reputation score in the MetricsDAO
              ecosystem.
            </p>
            <MarketingButton label="Launch App" link="/app/ecosystem" />
          </div>
          {/* Scroll Area */}
          <img src="/img/home-scroll-bg.svg" alt="" className="mx-auto rounded-3xl" />
          <p className="text-3xl font-bold">Analyze</p>
          <p>
            Source professional dashboards and tools that answer critical questions or solve complex problems. Analytics
            challenges can originate directly from partner requests or community brainstorms.
          </p>
          <p className="text-3xl font-bold">Brainstorm</p>
          <p>
            Optionally source and prioritize the best questions for analysts to answer. Community question brainstorms
            generally focus around a partner’s project or a timely Web3 topic or event.
          </p>
          <p className="text-3xl font-bold">Peer Review</p>
          <p>
            To effectively fulfill our partners’ requests, qualified reviewers are incentivized to enforce submission
            quality and help reward the best work for every challenge.
          </p>
        </div>
      </div>
    </>
  );
}

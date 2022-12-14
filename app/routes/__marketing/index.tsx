import { ArrowDownCircleIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import MarketingButton from "~/components/marketing-button/marketing-button";
import SocialIcons from "~/features/marketing-shell/SocialIcons";

export default function Index() {
  return (
    <>
      <img src="/img/marketing/homepage-bg-top.png" className="absolute top-0 left-0 -z-10 h-screen w-screen" alt="" />
      <div className="flex flex-row">
        <aside className="hidden md:block w-1/6">
          <div className="fixed top-1/3 left-0 flex flex-col items-center pt-8 pl-5 gap-y-5">
            <a href="#top">
              <GlobeAltIcon className="text-black h-7 w-7" />
            </a>
            <a href="#section-2">
              <img src="/img/circle-outline.svg" alt="" />
            </a>
            <a href="#section-3">
              <img src="/img/circle-outline.svg" alt="" />
            </a>
            <a href="#section-4">
              <img src="/img/circle-outline.svg" alt="" />
            </a>
            <a href="#section-5">
              <img src="/img/circle-outline.svg" alt="" />
            </a>
            <a href="#bottom">
              <ArrowDownCircleIcon className="text-black h-7 w-7" />
            </a>
          </div>
        </aside>
        <main className="px-8">
          <section id="section-1" className="space-y-5 pt-52 pb-36">
            <h1 className="font-bold text-8xl max-w-4xl">
              The <b className="text-white">DAO</b> for Web3 Data Analytics
            </h1>
            <p className="text-2xl max-w-lg">Connecting projects with the best analysts in Web3 for all data needs</p>
            <SocialIcons />
          </section>
          <img
            src="/img/marketing/homepage-bg-bottom.png"
            className="absolute top-100 left-0 -z-10 h-screen w-screen"
            alt=""
          />
          <div id="section-2" className="space-y-5 pt-24 pb-10 h-screen">
            <p className="text-white text-2xl">Our Mission</p>
            <p className="font-bold text-7xl">
              Creating a fair and flexible <b className="text-white">analytics marketplace</b> to remove barriers to
              <b className="text-white"> on-chain participation</b> and help <b className="text-white">Web3</b>{" "}
              organizations launch, grow, and <b className="text-white">succeed.</b>
            </p>
            <MarketingButton label="Explore the Ecosystem" link="/app/ecosystem" variant="outline" />
          </div>
          <div id="section-3" className="grid grid-cols-2 gap-x-5 py-36">
            <div className="max-w-lg space-y-10">
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
          <div id="section-4" className="grid grid-cols-2 gap-x-5 py-36">
            <img src="/img/home-results.png" alt="" />
            <div className="max-w-lg space-y-10">
              <h2 className="text-5xl font-bold">Rewarding the best analysts in Web3</h2>
              <p className="text-stone-500 text-lg">
                Analysts participate in challenges to earn partner reward tokens and rMETRIC while increasing their
                reputation in the ecosystem. Ongoing engagements that support partners’ goals also increase analysts’
                access to future earning opportunities.
              </p>
              <MarketingButton label="Learn about reputation & rMETRIC" link="" />
            </div>
          </div>
          <div id="section-5" className="grid grid-cols-2 gap-x-5 py-36">
            <div className="max-w-lg space-y-10">
              <h2 className="text-5xl font-bold">Scaling on-demand analytics with a decentralized app</h2>
              <p className="text-stone-500 text-lg">
                Partners fund time-bound challenges where analysts compete to answer questions or solve problems.
                Winners earn tokens from the partner reward pool while increasing their reputation score in the
                MetricsDAO ecosystem.
              </p>
              <MarketingButton label="Launch App" link="/app/ecosystem" />
            </div>
            <div
              className="bg-scroll rounded-3xl bg-contain overflow-y-auto h-48 w-48"
              style={{ backgroundImage: "url(/img/home-scroll-bg.svg)" }}
            >
              <div className="p-5 space-y-10 w-48">
                <div className="space-y-3">
                  <img src="/img/eye.png" alt="" />
                  <p className="text-3xl font-bold text-white pt-2">Analyze</p>
                  <p className="text-white text-lg">
                    Source professional dashboards and tools that answer critical questions or solve complex problems.
                    Analytics challenges can originate directly from partner requests or community brainstorms.
                  </p>
                </div>
                <div className="space-y-3">
                  <img src="/img/lightbulb.png" alt="" />
                  <p className="text-3xl font-bold text-white pt-2">Brainstorm</p>
                  <p className="text-white text-lg">
                    Optionally source and prioritize the best questions for analysts to answer. Community question
                    brainstorms generally focus around a partner’s project or a timely Web3 topic or event.
                  </p>
                </div>
                <div className="space-y-3">
                  <img src="/img/person-check.png" alt="" />
                  <p className="text-3xl font-bold text-white pt-2">Peer Review</p>
                  <p className="text-white text-lg">
                    To effectively fulfill our partners’ requests, qualified reviewers are incentivized to enforce
                    submission quality and help reward the best work for every challenge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

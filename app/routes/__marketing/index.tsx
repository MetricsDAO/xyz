import { ArrowDownCircleIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import MarketingButton from "~/components/marketing-button/marketing-button";
import SocialIcons from "~/features/marketing-shell/social-icons";

export default function Index() {
  return (
    <>
      <div className="flex flex-row">
        <aside className="hidden md:block w-1/6">
          <div className="fixed top-1/3 left-0 flex flex-col items-center pt-8 pl-5 gap-y-5">
            <a href="#top">
              <GlobeAltIcon className="text-black h-7 w-7" />
            </a>
            <a href="#mission">
              <img src="/img/circle-outline.svg" alt="" />
            </a>
            <a href="#partner">
              <img src="/img/circle-outline.svg" alt="" />
            </a>
            <a href="#learn">
              <img src="/img/circle-outline.svg" alt="" />
            </a>
            <a href="#scaling">
              <img src="/img/circle-outline.svg" alt="" />
            </a>
            <a href="#bottom">
              <ArrowDownCircleIcon className="text-black h-7 w-7" />
            </a>
          </div>
        </aside>
        <main className="px-8">
          <img
            src="/img/marketing/homepage-bg-top.png"
            className="absolute top-0 left-0 -z-10 h-screen w-screen"
            alt=""
          />
          <section className="space-y-5 h-screen -mt-16 pt-16 flex flex-col justify-center">
            <h1 className="font-bold text-5xl md:text-8xl max-w-4xl pt-7">
              The <b className="text-white">DAO</b> for Web3 Data Analytics
            </h1>
            <p className="text-lg md:text-2xl max-w-lg">
              Connecting projects with the best analysts in Web3 for all data needs
            </p>
            <SocialIcons />
          </section>
          <img
            src="/img/marketing/homepage-bg-bottom.png"
            className="absolute top-100 left-0 -z-10 h-screen w-screen"
            alt=""
          />
          <div id="mission" className="space-y-5 h-screen flex flex-col justify-center">
            <p className="text-white text-2xl">Our Mission</p>
            <p className="font-bold text-4xl md:text-6xl lg:text-7xl">
              Creating a fair and flexible <b className="text-white">analytics marketplace</b> to remove barriers to
              <b className="text-white"> on-chain participation</b> and help <b className="text-white">Web3</b>{" "}
              organizations launch, grow, and <b className="text-white">succeed.</b>
            </p>
            <MarketingButton label="Explore the Ecosystem" link="/app/ecosystem" variant="outline" />
          </div>
          <InfoSection id="partner">
            <img src="/img/marketing/home-checkmark.png" alt="" className="mx-auto md:order-2 w-full max-w-fit" />
            <div className="max-w-lg space-y-10 mx-auto md:m-0">
              <h2 className="text-4xl md:text-5xl font-bold">Providing on-demand data to power your organization</h2>
              <p className="text-stone-500 text-lg">
                To drive insights, data often needs to be analyzed through a series of complex and time-consuming
                processes. By partnering with MetricsDAO, organizations can tap the world’s best Web3 analyst community
                and streamline access to expert analytics work.
              </p>
              <MarketingButton label="Partner with us" link="/partner" />
            </div>
          </InfoSection>
          <InfoSection id="learn">
            <img src="/img/marketing/home-results.png" alt="" className="mx-auto md:m-0 w-full max-w-fit" />
            <div className="max-w-lg space-y-10 mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold">Rewarding the best analysts in Web3</h2>
              <p className="text-stone-500 text-lg">
                Analysts participate in challenges to earn partner reward tokens and rMETRIC while increasing their
                reputation in the ecosystem. Ongoing engagements that support partners’ goals also increase analysts’
                access to future earning opportunities.
              </p>
              <MarketingButton label="Learn about reputation & rMETRIC" link="" />
            </div>
          </InfoSection>
          <InfoSection id="scaling">
            {/*<div
              className="rounded-3xl bg-auto bg-no-repeat p-10 space-y-3 w-min h-min mx-auto md:order-2"
              style={{ backgroundImage: "url(/img/home-scroll-bg.svg)" }}
            >
              <img src="/img/eye.png" alt="" />
              <p className="text-3xl font-bold text-white pt-2">Analyze</p>
              <p className="text-white text-lg w-80">
                Source professional dashboards and tools that answer critical questions or solve complex problems.
                Analytics challenges can originate directly from partner requests or community brainstorms.
              </p>
              <div className="space-y-3">
                <img src="/img/lightbulb.png" alt="" />
                <p className="text-3xl font-bold text-white pt-2">Brainstorm</p>
                <p className="text-white text-lg max-w-sm">
                  Optionally source and prioritize the best questions for analysts to answer. Community question
                  brainstorms generally focus around a partner’s project or a timely Web3 topic or event.
                </p>
              </div>
              <div className="space-y-3">
                <img src="/img/person-check.png" alt="" />
                <p className="text-3xl font-bold text-white pt-2">Peer Review</p>
                <p className="text-white text-lg max-w-sm">
                  To effectively fulfill our partners’ requests, qualified reviewers are incentivized to enforce
                  submission quality and help reward the best work for every challenge.
                </p>
                </div>
            </div>*/}
            <div className="max-w-lg space-y-10 mx-auto md:m-0">
              <h2 className="text-4xl md:text-5xl font-bold">Scaling on-demand analytics with a decentralized app</h2>
              <p className="text-stone-500 text-lg">
                Partners fund time-bound challenges where analysts compete to answer questions or solve problems.
                Winners earn tokens from the partner reward pool while increasing their reputation score in the
                MetricsDAO ecosystem.
              </p>
              <MarketingButton label="Launch App" link="/app/ecosystem" />
            </div>
          </InfoSection>
        </main>
      </div>
    </>
  );
}

function InfoSection({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <div
      id={id}
      className="max-w-screen-xl grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10 py-10 md:py-36 items-center mx-auto"
    >
      {children}
    </div>
  );
}

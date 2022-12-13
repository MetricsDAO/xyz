import MarketingButton from "~/components/marketing-button/marketing-button";
import SocialIcons from "~/features/marketing-shell/SocialIcons";

export default function Index() {
  return (
    <>
      {/*Todo: h + w */}
      <img src="/img/homepage-blur.png" className="absolute top-0 left-0 -z-10" alt="" />
      <div className="px-16">
        <div className="space-y-5 pt-52 pb-52">
          <h1 className="font-bold text-7xl flex gap-x-2">
            The <h1 className="text-white">DAO</h1> for Web3 Data Analytics
          </h1>
          <p className="text-xl max-w-md">Connecting projects with the best analysts in Web3 for all data needs</p>
          <SocialIcons />
        </div>
        <div className="grid grid-cols-2 gap-x-5 py-36">
          <div className="max-w-lg space-y-5">
            <h2 className="text-5xl font-bold">Providing on-demand data to power your organization</h2>
            <p className="text-stone-500">
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
            <p className="text-stone-500">
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
            <p className="text-stone-500">
              Partners fund time-bound challenges where analysts compete to answer questions or solve problems. Winners
              earn tokens from the partner reward pool while increasing their reputation score in the MetricsDAO
              ecosystem.
            </p>
            <MarketingButton label="Launch App" link="/app/ecosystem" />
          </div>
          {/* Scroll Area */}
          <div className="h-50 w-50 bg-purple-200 rounded-lg" />
        </div>
      </div>
    </>
  );
}

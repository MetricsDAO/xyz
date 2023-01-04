import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ArrowDownCircleIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import MarketingButton from "~/components/marketing-button/marketing-button";
import Footer from "~/features/marketing-shell/footer";

export default function Index() {
  return (
    <>
      <div className="relative">
        <img
          src="/img/marketing/partner-bg-testimony.png"
          className="absolute bottom-0 left-0 -z-10 h-screen w-screen"
          alt=""
        />
        <div className="flex flex-row">
          <aside className="hidden md:block w-1/6">
            <div className="fixed top-1/3 left-0 flex flex-col items-center pt-8 pl-5 gap-y-5 z-10">
              <a href="#top">
                <GlobeAltIcon className="text-black h-7 w-7" />
              </a>
              <a href="#why">
                <img src="/img/circle-outline.svg" alt="" />
              </a>
              <a href="#offerings">
                <img src="/img/circle-outline.svg" alt="" />
              </a>
              <a href="#testimony">
                <img src="/img/circle-outline.svg" alt="" />
              </a>
              <a href="#bottom">
                <ArrowDownCircleIcon className="text-black h-7 w-7" />
              </a>
            </div>
          </aside>
          <main className="pl-8 pr-12">
            <img
              src="/img/marketing/partner-bg-logos.png"
              className="absolute top-0 left-0 -z-10 h-screen w-screen"
              alt=""
            />
            <section className="space-y-5 h-screen -mt-16 pt-16 flex flex-col justify-center mx-auto max-w-3xl ">
              <h1 className="font-bold text-4xl md:text-6xl pt-7 text-center">Work With the Best Analyists in Web3</h1>
              <p className="text-lg md:text-2xl text-center">
                Access the best community of Web3 analysts for on-demand analytics and tooling! Everything analysts
                create is peer reviewed to ensure quality and accuracy.
              </p>
              <MarketingButton label="Explore the ecosystem" link="/ecosystem" />
            </section>
            <img
              src="/img/marketing/partner-bg-why.png"
              className="absolute top-100 left-0 -z-10 h-screen w-screen"
              alt=""
            />
            <section id="why" className="space-y-5 h-screen flex flex-col justify-center">
              <p className="text-white text-2xl">Why MetricsDAO?</p>
              <p className="font-bold text-2xl md:text-3xl lg:text-4xl pr-24">
                Incubated by Flipside Crypto and other <b className="text-white">industry leaders</b>, MetricsDAO
                provides a home for the <b className="text-white">most talented analysts</b> to collaborate, compete,
                and grow, while offering the necessary frameworks to efficiently deliver{" "}
                <b className="text-white">high-quality insights</b> to any project in the{" "}
                <b className="text-white">Web3</b> space.
              </p>
              <MarketingButton label="Get In Touch" link="/todo" variant="outline" />
            </section>
            <section id="offerings" className="space-y-10 mx-auto pt-12 pb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-center">Our Core Offerings</h2>
              <MarketingButton label="Get In Touch" link="/todo" />
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="relative mx-auto">
                  <img src="/img/marketing/partner-frame-rocket.png" className="-z-10" alt="" />
                  <div className="absolute top-0 left-0 text-white text-base max-w-xs mx-5 pt-36 space-y-5">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">Analytics on Demand</p>
                      <p className="text-xl">Starts at $1,000</p>
                    </div>
                    <p>Access on-demand blockchain analytics from our community of experts.</p>
                    <p>For any organization or project in need of Web3 analytics.</p>
                  </div>
                </div>
                <div className="relative mx-auto">
                  <img src="/img/marketing/partner-frame-plant.png" className="-z-10" alt="" />
                  <div className="absolute top-0 left-0 text-white text-base max-w-xs mx-5 pt-36 space-y-5">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">Community Growth</p>
                      <p className="text-xl">Starts at $10,000</p>
                    </div>
                    <p>
                      Onboard and grow a community of analysts to drive adoption, usage, and analytics for your project.
                    </p>
                    <p>For any blockchain or protocol with curated data.</p>
                  </div>
                </div>
                <div className="relative mx-auto">
                  <img src="/img/marketing/partner-frame-butterfly.png" className="-z-10" alt="" />
                  <div className="absolute top-0 left-0 text-white text-base max-w-xs mx-5 pt-36 space-y-5">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">Data Readiness</p>
                      <p className="text-xl">Starts at $20,000</p>
                    </div>
                    <p>Unlock potential adoption, usage, and analytics for your project with community curated data.</p>
                    <p>For any blockchain or protocol in need of data curation.</p>
                  </div>
                </div>
              </div>
            </section>
            <section id="testimony" className="space-y-10 py-16">
              <img src="/img/marketing/logo-uniswap.png" alt="" className="mx-auto" />
              <p className="text-white text-4xl max-w-3xl text-center mx-auto">
                "The Uniswap Foundation empowers users through community-driven analytics and{" "}
                <b>supports initiatives like MetricsDAO to create data-driven narratives and insights."</b>
              </p>
              <div className="text-white flex items-center justify-center">
                <ChevronRightIcon className="text-white h-6 w-6" />
                <p className="text-xl">
                  <b>Fede Basta</b> Uniswap Grants Program
                </p>
              </div>
              <MarketingButton label="Explore the ecosystem" link="/ecosystem" variant="outline" />
            </section>
          </main>
        </div>
        <Footer variant="transparent" />
      </div>
    </>
  );
}

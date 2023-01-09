import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ArrowDownCircleIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import MarketingButton from "~/components/marketing-button/marketing-button";
import Footer from "~/features/marketing-shell/footer";

export default function Index() {
  return (
    <>
      <div>
        <div className="relative flex flex-row">
          <img
            src="/img/marketing/partner-bg-testimony.png"
            className="absolute bottom-0 left-0 -z-10 h-screen w-screen"
            alt=""
          />
          <aside className="hidden lg:block w-1/6 absolute">
            <div className="fixed top-1/3 left-0 flex flex-col items-center pt-8 pl-5 gap-y-5 -z-10">
              <div className="w-1 h-20 mx-2.5 mt-7 relative top-0">
                <div id="pageProgress" style={{ height: `0%` }} className="w-0.5 ml-px h-full bg-black " />
              </div>
            </div>
            <div className="fixed top-1/3 left-0 flex flex-col items-center pt-8 pl-5 gap-y-5 z-10">
              <a href="#top">
                <GlobeAltIcon className="text-black h-6 w-6" />
              </a>
              <a href="#why">
                <Circle id="whyCircle" />
              </a>
              <a href="#offerings">
                <Circle id="offeringsCircle" />
              </a>
              <a href="#testimony">
                <Circle id="testimonyCircle" />
              </a>
              <a href="#bottom">
                <ArrowDownCircleIcon className="text-black h-6 w-6" />
              </a>
            </div>
          </aside>
          <main className="flex-1">
            <section className="space-y-5 h-screen -mt-16 sm:pt-16 flex flex-col items-center justify-center bg-contain bg-no-repeat bg-center bg-[url('/img/marketing/partner-bg-logos-mobile.png')] sm:bg-[url('/img/marketing/partner-bg-logos.png')]">
              <h1 className="font-bold text-4xl md:text-6xl sm:pt-7 text-center max-w-3xl px-8">
                Work With the Best Analyists in Web3
              </h1>
              <p className="text-lg md:text-2xl text-center max-w-3xl px-8">
                Access the best community of Web3 analysts for on-demand analytics and tooling! Everything analysts
                create is peer reviewed to ensure quality and accuracy.
              </p>
              <div className="flex flex-col items-center">
                <MarketingButton label="Explore the ecosystem" link="/ecosystem" />
              </div>
            </section>
            <img
              src="/img/marketing/partner-bg-why.png"
              className="absolute top-100 left-0 -z-10 h-screen w-screen"
              alt=""
            />
            <section id="why" className="space-y-5 h-screen flex flex-col justify-center items-start lg:ml-10 px-8">
              <p className="text-white text-2xl">Why MetricsDAO?</p>
              <p className="font-bold text-2xl md:text-3xl lg:text-4xl md:leading-relaxed lg:leading-relaxed max-w-6xl">
                Incubated by Flipside Crypto and other <b className="text-white">industry leaders</b>, MetricsDAO
                provides a home for the <b className="text-white">most talented analysts</b> to collaborate, compete,
                and grow, while offering the necessary frameworks to efficiently deliver{" "}
                <b className="text-white">high-quality insights</b> to any project in the{" "}
                <b className="text-white">Web3</b> space.
              </p>
              <MarketingButton label="Get In Touch" link="/todo" variant="outline" />
            </section>
            <section
              id="offerings"
              className="space-y-10 flex flex-col items-center pt-12 pb-10 lg:ml-10 px-8 lg:h-screen"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center">Our Core Offerings</h2>
              <MarketingButton label="Get In Touch" link="/todo" />
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="mx-auto">
                  <div className="bg-[url(/img/marketing/partner-core-left.png)] bg-cover bg-no-repeat rounded-3xl text-white text-base max-w-xs px-5 pt-7 pb-16 space-y-5">
                    <img src="/img/marketing/partner-rocket.png" alt="" />
                    <div className="space-y-1">
                      <p className="text-xl sm:text-2xl font-bold">Analytics on Demand</p>
                      <p className="text-lg sm:text-xl">Starts at $1,000</p>
                    </div>
                    <p className="text-sm sm:text-base">
                      Access on-demand blockchain analytics from our community of experts.
                    </p>
                    <p className="text-sm sm:text-base">For any organization or project in need of Web3 analytics.</p>
                  </div>
                </div>
                <div className="mx-auto">
                  <div className="bg-[url(/img/marketing/partner-core-middle.png)] bg-cover bg-no-repeat rounded-3xl text-white text-base max-w-xs px-5 pt-7 pb-16 space-y-5">
                    <img src="/img/marketing/partner-plant.png" alt="" />
                    <div className="space-y-1">
                      <p className="text-xl sm:text-2xl font-bold">Community Growth</p>
                      <p className="text-lg sm:text-xl">Starts at $10,000</p>
                    </div>
                    <p className="text-sm sm:text-base">
                      Onboard and grow a community of analysts to drive adoption, usage, and analytics for your project.
                    </p>
                    <p className="text-sm sm:text-base">For any blockchain or protocol with curated data.</p>
                  </div>
                </div>
                <div className="mx-auto">
                  <div className="bg-[url(/img/marketing/partner-core-right.png)] bg-cover bg-no-repeat rounded-3xl text-white text-base max-w-xs px-5 pt-7 pb-16 space-y-5">
                    <img src="/img/marketing/partner-butterfly.png" alt="" />
                    <div className="space-y-1">
                      <p className="text-xl sm:text-2xl font-bold">Data Readiness</p>
                      <p className="text-lg sm:text-xl">Starts at $20,000</p>
                    </div>
                    <p className="text-sm sm:text-base">
                      Unlock potential adoption, usage, and analytics for your project with community curated data.
                    </p>
                    <p className="text-sm sm:text-base">For any blockchain or protocol in need of data curation.</p>
                  </div>
                </div>
              </div>
            </section>
            <section
              id="testimony"
              className="space-y-10 py-16 h-screen justify-center flex flex-col items-center px-8"
            >
              <img src="/img/marketing/logo-uniswap.png" alt="" className="mx-auto" />
              <p className="text-white text-2xl md:text-4xl max-w-3xl text-center mx-auto">
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
        <Footer variant="circle" />
      </div>
    </>
  );
}

function Circle({ id }: { id: string }) {
  return (
    <svg id={id} width="6" height="6" viewBox="0 0 6 6" style={{ fill: "none" }} xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="3" r="2.5" stroke="#252525" />
    </svg>
  );
}

// When the user scrolls the page, execute scrollNav
if (typeof window !== "undefined") {
  window.onscroll = function () {
    scrollNav();
  };
}

function scrollNav() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("pageProgress")!.style.height = scrolled + "%";
  scrolled > 16
    ? (document.getElementById("whyCircle")!.style.fill = "black")
    : (document.getElementById("whyCircle")!.style.fill = "none");
  scrolled > 52
    ? (document.getElementById("offeringsCircle")!.style.fill = "black")
    : (document.getElementById("offeringsCircle")!.style.fill = "none");
  scrolled > 88
    ? (document.getElementById("testimonyCircle")!.style.fill = "black")
    : (document.getElementById("testimonyCircle")!.style.fill = "none");
}

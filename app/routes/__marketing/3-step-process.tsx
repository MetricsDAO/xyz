import Header from "~/features/marketing-shell/header";
import { Disclosure } from "@headlessui/react";
import AppFooter from "~/features/marketing-shell/footer";
import Aos from "aos";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    Aos.init({
      once: true,
    });
  }, []);

  return (
    <div className="three-step">
      <section className="hero-3-step">
        <div className="container site-header">
          <Header />
          <div className="content intro text-center h-screen lg:h-auto flex flex-col justify-center">
            <h1 className="section-title font-semibold" data-aos="fade" data-aos-duration="1000">
              Switch on the analytics engine.
            </h1>
            <p className="text-3xl mb-14 max-w-3xl mx-auto font-medium">
              Partner with our community of world-class blockchain data analysts to generate actionable analytics and
              onboard new users
            </p>
            <div data-aos="fade" data-aos-delay="300" data-aos-duration="2000">
              <a
                className="btn-main"
                target="_blank"
                href="https://docs.google.com/forms/d/e/1FAIpQLSdh5JDUp-7MSl-N-Mk_4hNWmGdNRkpcdhzuLMbSP0ef9f094Q/viewform"
                rel="noreferrer"
              >
                <span>PARTNER WITH US</span>
                <span>
                  <i className="bi bi-arrow-right-short"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="how-it-works section-1">
        <div className="container flex items-center justify-around">
          <div className="" data-aos="fade-up" data-aos-duration="1000">
            <h2 className="section-label text-xl sm:text-2xl ">HOW IT WORKS</h2>
          </div>
          <div className="max-w-2xl text-xl ">
            <h4 className="sm:text-4xl mb-8 text-xl">
              MetricsDAO provides an <strong>organized three step process </strong> for DAOs to receive the analytics,
              tooling and content they need in near real time.
            </h4>

            <h4 className="sm:text-4xl text-xl  mb-8">
              Each step works as a distinct component of on-demand analytics, and serves a unique purpose that can be
              activated alone or in combination with the other two.
            </h4>

            <a target="_blank" href="https://metricsdao.xyz/dashboard" rel="noreferrer" className="sm:text-4xl text-xl">
              <h5>Let the data speak for itself → </h5>
            </a>
            <p className="max-w-xs text-xl mt-3">
              Over 160 analysts have created 900+ dashboards in the first half of 2022.
            </p>
          </div>
          <div className="image-holder invisible">Empty text Empty text Empty text Empty text</div>
        </div>
      </section>
      <section className="overview-steps py-20">
        <div className="community-brainstorm container flex flex-col sm:flex-row mb-40 justify-around">
          <div className="">
            <h2 className="text-lg rotate">
              <span className="component">Component</span>
              <span className="component-step">01</span>
            </h2>
          </div>
          <div className="">
            <h1 className="font-bold mb-4 text-2xl sm:text-6xl max-w-md">Community Brainstorming</h1>
            <h4 className="sub-heading-3step font-medium text-2xl sm:text-4xl mb-20 max-w-lg">
              To Engage &amp; Educate
            </h4>
            <p className="text-xl max-w-lg mb-10">
              Ask the broader community what analytics they would like to see created. Anyone can submit questions
              and/or upvote others’ so that the most relevant questions are prioritized, and spam is filtered out.
            </p>
            <p className="text-xl max-w-lg">
              The goal of the Community Brainstorming Component is to drive engagement with the broader community: to
              understand what is currently relevant, confusing, or worrisome to them. At the same time, rewarding
              participants at this level works to educate newcomers on how your protocol works and incentivizes the best
              ideas to rise to the top.
            </p>
          </div>
          <div className="image-holder" data-aos="fade-up" data-aos-delay="300" data-aos-duration="2000">
            <img src="/img/three-step-process/step-1-image.png" alt="step one" />
          </div>
        </div>
        <div className="analytics container flex flex-col sm:flex-row mb-40 justify-around">
          <div className="">
            <h2 className="text-lg rotate">
              <span className="component">Component</span>
              <span className="component-step">02</span>
            </h2>
          </div>
          <div data-aos="fade-up" data-aos-delay="300" data-aos-duration="2000">
            <h1 className="font-bold mb-4 text-2xl sm:text-6xl max-w-md">Analytics</h1>
            <h4 className="sub-heading-3step font-medium text-2xl sm:text-4xl mb-20 max-w-lg">
              {" "}
              To Generate Insights &amp; Drive User Onboarding
            </h4>
            <p className="text-xl max-w-lg mb-10">
              Tap MetricsDAO’s community of analysts to create the analytics, tooling and content you need. With this
              component, organizations can choose to activate the questions sourced from the community brainstorm, or
              submit their own questions or tasks that need solving.
            </p>
            <p className="text-xl max-w-lg">
              This component allows organizations to not only generate the insights they need, but also onboard new
              analysts and new users to their protocol.
            </p>
            <p className="mt-5">
              <a className="btn btn-sm btn-outline-primary rounded-pill px-3" href="https://metricsdao.xyz/showcase">
                VIEW EXAMPLE ANALYTICS <i className="bi bi-arrow-right-short"></i>
              </a>
            </p>
          </div>
          <div className="image-holder">
            <img src="/img/three-step-process/step-2-image.png" alt="step two" />
          </div>
        </div>
        <div className="peer-review container flex flex-col sm:flex-row mb-20 justify-around">
          <div className="">
            <h2 className="text-lg rotate">
              <span className="component">Component</span>
              <span className="component-step">03</span>
            </h2>
          </div>
          <div className="">
            <h1 className="font-bold mb-4 text-2xl sm:text-6xl max-w-md">Peer Review</h1>
            <h4 className="sub-heading-3step font-medium text-2xl sm:text-4xl mb-20 max-w-lg">
              {" "}
              To Create Legitimacy &amp; Promote Your Protocol
            </h4>
            <p className="text-xl max-w-lg mb-10">
              Analytics, tools and content are peer reviewed by a dynamic network of top analysts in order to validate
              and score results. This component is gated to participants, and requires a certain amount of tokens for
              someone to become a Reviewer.
            </p>
            <p className="text-xl max-w-lg">
              Beyond removing low quality or spam submissions (spam should already be reduced by the token gating
              mechanisms in place in Component 2), the Peer Review Component allows us to highlight (and promote) the
              best outputs. This creates valuable marketing for your protocol.
            </p>
          </div>
          <div className="image-holder" data-aos="fade-up" data-aos-delay="300" data-aos-duration="2000">
            <img src="/img/three-step-process/step-3-image.png" alt="step three" />
          </div>
        </div>
      </section>
      <section className="protocols">
        <div className="container flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <img src="/img/three-step-process/protocols.png" alt="protocol logos" />
          </div>
          <div className="max-w-2xl" data-aos="fade-up" data-aos-delay="300" data-aos-duration="2000">
            <p className=" sm:text-4xl text-xl mb-10">
              <strong>“MetricsDAO has been a pleasure to work with. </strong> We were already impressed with the team
              and the quality of output, so a further collaboration was a no-brainer. The Harmony community now has
              access to extremely valuable insights to understand critical metrics.”
            </p>
            <p className="text-xl">
              <strong className="block">Giv Parvaneh</strong> Senior Blockchain Engineer – Harmony
            </p>
          </div>
        </div>
      </section>
      <section className="faqs py-20">
        <div className="container">
          <Disclosure>
            {({ open }) => (
              <div
                className={`wrapper p-4 border-solid border-[#E9FAFE] rounded-lg border-2 mb-10 ${
                  open ? "bg-[#E9FAFE]" : "bg-transparent"
                }`}
              >
                <Disclosure.Button className="flex justify-between align-center w-full">
                  <span className="font-semibold self-center text-xl sm:text-2xl">What is MetricsDAO’s mission?</span>{" "}
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4 w-5/6 font-light text-xl sm:text-2xl">
                  Automating and decentralizing every step of the process to give us the speed and flexibility needed to
                  support building this ecosystem. At the same time we strive to empower a dynamic group of analysts so
                  that we can continue to scale over time.
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
          <Disclosure>
            {({ open }) => (
              <div
                className={`wrapper p-4 border-solid border-[#E9FAFE] rounded-lg border-2 mb-10 ${
                  open ? "bg-[#E9FAFE]" : "bg-transparent"
                }`}
              >
                <Disclosure.Button className="flex justify-between align-center w-full">
                  <span className="font-semibold self-center text-xl sm:text-2xl">How are analysts paid?</span>{" "}
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4 w-5/6 font-light text-xl sm:text-2xl">
                  Analysts are paid in partner project’s native tokens and/or in stablecoins.
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
          <Disclosure>
            {({ open }) => (
              <div
                className={`wrapper p-4 border-solid border-[#E9FAFE] rounded-lg border-2 mb-10 ${
                  open ? "bg-[#E9FAFE]" : "bg-transparent"
                }`}
              >
                <Disclosure.Button className="flex justify-between align-center w-full">
                  <span className="font-semibold self-center text-xl sm:text-2xl">
                    I have questions I need answered. Can I skip straight to analytics?
                  </span>{" "}
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4 w-5/6 font-light text-xl sm:text-2xl">
                  Yes! Mix and match the three components of the on-demand analytics process to best serve your needs.
                  Just getting started and looking to onboard more users? Start with question generation. Have a
                  question you need answered? Run the analytics engine.
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
          <Disclosure>
            {({ open }) => (
              <div
                className={`wrapper p-4 border-solid border-[#E9FAFE] rounded-lg border-2 mb-10 ${
                  open ? "bg-[#E9FAFE]" : "bg-transparent"
                }`}
              >
                <Disclosure.Button className="flex justify-between align-center w-full">
                  <span className="font-semibold self-center text-xl sm:text-2xl">
                    How much does each component cost?
                  </span>{" "}
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4 w-5/6 font-light text-xl sm:text-2xl">
                  We can tailor our programs (in terms of components; number of tasks and/or timeframe) to work with
                  budgets of $5K - $200K.
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        </div>
      </section>
      <AppFooter />
    </div>
  );
}

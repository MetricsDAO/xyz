import AppFooter from "~/components/Footer";
import Header from "~/components/Header";
import SocialIcons from "~/components/SocialIcons";

export default function Index() {
  return (
    <>
      <section className="hero-section">
        <section className="site-header">
          <div className="container">
            <Header />
            <section className="intro tw-text-center tw-h-screen lg:tw-h-auto tw-flex tw-flex-col tw-justify-center">
              <h1 className="section-title" data-aos="fade" data-aos-duration="1000">
                <strong>On-Demand Data Analytics for Crypto Projects</strong>
              </h1>
              <div data-aos="fade" data-aos-delay="300" data-aos-duration="2000">
                <a className="btn-main" href="https://discord.gg/p3GMjK2zAr">
                  <span>
                    <i className="bi bi-discord tw-mr-2"></i>
                    JOIN
                  </span>
                  <span>
                    <i className="bi bi-arrow-right-short"></i>
                  </span>
                </a>
              </div>
              <div className="tw-flex lg:tw-hidden tw-list-none tw-justify-center tw-absolute tw-w-full tw-left-0 tw-bottom-16">
                <SocialIcons />
              </div>
            </section>
          </div>
        </section>
        <section className="tw-text-center tw-bg-white lg:tw-bg-transparent">
          <div className="container tw-flex tw-flex-col lg:tw-flex-row tw-gap-20 tw-py-24">
            <div
              className="feature tw-mx-6 lg:tw-mx-auto"
              data-aos="fade"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="feature-icon">
                <img src="img/equal.png" alt="" />
              </div>
              <p>
                We believe that <span className="fw-bold">equal access to on-chain data</span>, regardless of provider,
                is necessary to answer the most pressing questions for decentralized organizations.
              </p>
            </div>
            <div
              className="feature tw-mx-6 lg:tw-mx-auto"
              data-aos="fade"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="feature-icon">
                <img src="img/empowering.png" alt="" />
              </div>
              <p>
                We believe that <span className="fw-bold">empowering analysts</span>, irrespective of financial or
                geographic circumstance, will unleash groundbreaking solutions and innovations for the entire blockchain
                ecosystem.
              </p>
            </div>
            <div
              className="feature tw-mx-6 lg:tw-mx-auto"
              data-aos="fade"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="feature-icon">
                <img src="img/operating.png" alt="" />
              </div>
              <p>
                We believe that a <span className="fw-bold">new operating system connecting DAOs with analysts</span>{" "}
                will fuel the Organized Power Usage needed to drive the next era of Web3 development.
              </p>
            </div>
          </div>
        </section>
      </section>
      <section className="section-1">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="row section-what-we-do">
            <div className="col-1" data-aos="fade-up" data-aos-duration="1000">
              <h2 className="section-label">About MetricsDAO</h2>
            </div>
            <div className="col-10 col-lg-8 col-xl-6 offset-2 offset-lg-1 offset-xl-2">
              <p className="text-content">
                The three-step Brainstorming, Analytics, and Review system provides a variety of ways for the community
                and Web3 organizations to generate engagement, education, content, and peer reviewed analytics about
                protocols or topics they care about. Each step can be activated on its own or together.
              </p>
            </div>
            <div className="col-12" data-aos="fade" data-aos-delay="300" data-aos-duration="2000">
              <p className="text-center pt-5 mt-5 d-flex flex-md-row flex-column justify-content-center align-items-center">
                <a
                  href="/docs/metricsdao-whitepaper-2022.pdf"
                  className="btn btn-sm btn-outline-light rounded-pill px-3 mx-2 mb-4"
                >
                  READ THE WHITEPAPER <i className="bi bi-arrow-right-short"></i>
                </a>
                <a
                  href="https://metricsdao.ghost.io/"
                  className="btn btn-sm btn-outline-light rounded-pill px-3 mx-2 mb-4"
                >
                  VIEW BLOG <i className="bi bi-arrow-right-short"></i>
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-2" id="roadmap">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="row">
            <div className="col-12 text-center" data-aos="fade" data-aos-delay="300" data-aos-duration="2000">
              <h2 className="section-title">3 Components to Engage, Educate and Create Peer Reviewed Analytics</h2>
            </div>
          </div>
        </div>
      </section>
      <section className="section-3">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="row section-creation">
            <div className="col-6 box-content">
              <h3 className="section-subtitle">
                <span className="fw-bold">Community Brainstorming</span>
              </h3>
              <p>
                Submit questions and/or upvote others’ so that the most relevant questions are prioritized, and spam is
                filtered out. No xMETRIC is required to participate in this component. Qualified submissions will earn
                50 xMETRIC and $10 in partner tokens or stablecoins. Qualified upvotes will earn 5 xMETRIC.
              </p>
              <p>
                <a className="btn btn-sm btn-outline-primary rounded-pill px-3" href="https://bounty.metricsdao.xyz/">
                  Join a Community Brainstorm <i className="bi bi-arrow-right-short"></i>
                </a>
              </p>
            </div>
            <div className="col-6" data-aos="fade-up" data-aos-delay="300" data-aos-duration="2000">
              <img src="img/pic-creation.png" alt="" className="img-fluid" />
            </div>
          </div>
          <div className="row section-generation">
            <div className="col-6 order-1 order-lg-0" data-aos="fade-up" data-aos-delay="300" data-aos-duration="2000">
              <img src="img/pic-generation.png" alt="" className="img-fluid" />
            </div>
            <div className="col-6 box-content">
              <h4 className="section-subtitle">
                <span className="fw-bold">Analytics </span>
              </h4>
              <p>
                In this component, questions are turned into actionable bounties for our community of analysts to solve
                by creating analytics, tools and/or content. Analytics are rewarded in partner tokens or stablecoins.
                Most bounties require no xMETRIC to solve.
              </p>
              <p>
                <a
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  href="https://metricsdao.notion.site/metricsdao/Bounty-Programs-d4bac7f1908f412f8bf4ed349198e5fe"
                >
                  VIEW OPEN REQUESTS <i className="bi bi-arrow-right-short"></i>
                </a>
              </p>
            </div>
          </div>
          <div className="row section-review">
            <div className="col-6 box-content">
              <h4 className="section-subtitle">
                <span className="fw-bold">Peer Review</span>
              </h4>
              <p>
                Analytics, tools and content are peer reviewed by a dynamic network of top analysts in order to validate
                and score results. This component is gated for analysts who have earned 2,000 xMETRIC or more and
                demonstrated their crypto analytics proficiency.
              </p>
              <p>
                <a
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  href="https://metricsdao.ghost.io/xmetric/"
                >
                  Learn more about xMETRIC <i className="bi bi-arrow-right-short"></i>
                </a>
              </p>
            </div>
            <div className="col-6" data-aos="fade-up" data-aos-delay="300" data-aos-duration="2000">
              <img src="img/pic-review.png" alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
      <section className="section-4" id="contactus">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="row">
            <div className="col-12 text-center">
              <p className="section-title my-5" data-aos="fade" data-aos-duration="1000">
                Looking for <br className="mobile-break" />
                <span className="fw-bold">
                  on-chain <br className="mobile-break" />
                  analytics
                </span>{" "}
                <br className="d-none d-lg-block" />
                for <br className="mobile-break" />
                your own <br className="mobile-break" />
                project?
              </p>
              <div data-aos="fade-up" data-aos-delay="300" data-aos-duration="2000">
                <a className="btn-main-white" href="https://partnerwith.metricsdao.xyz">
                  <span>PARTNER WITH US!</span>
                  <span>
                    <i className="bi bi-arrow-right-short"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppFooter />
    </>
  );
}

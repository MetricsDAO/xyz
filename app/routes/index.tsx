import LandingHeader from "../components/landing-header";

export default function Index() {
  return (
    <>
      <LandingHeader />
      <section className="section-1">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="row section-what-we-do">
            <div className="col-1" data-aos="fade-up" data-aos-duration="1000">
              <h2 className="section-label">About MetricsDAO</h2>
            </div>
            <div className="col-10 col-lg-8 col-xl-6 offset-2 offset-lg-1 offset-xl-2">
              {/* <p className="text-content">
                <span className="fw-bold">
                  MetricsDAO provides{" "}
                  <span>
                    on-demand{" "}
                    <img
                      alt="Metrics"
                      src="img/icon-custom-chevron.png"
                      className="icon-custom"
                    />
                  </span>{" "}
                  analytics for crypto projects in near real-time.
                </span>{" "}
                Its operating system sources the right questions, provides
                community solutions, and rewards analysts in the project’s
                native token - thereby driving user growth and acquisition for
                DAOs.
              </p> */}
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
              {/* <h2 className="section-title">
                Organized
                <br className="mobile-break" />{" "}
                <span className="fw-bold">
                  On-Demand{" "}
                  <span>
                    Analytics{" "}
                    <img
                      src="img/icon-custom-chevron.png"
                      className="icon-custom"
                    />
                  </span>
                </span>
                <br /> Delivery for
                <br className="mobile-break" /> Crypto Projects
              </h2> */}
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
          {/* <div className="row section-payment">
            <div
              className="col-6 order-2 order-lg-0"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <img src="img/pic-payment.png" alt="" className="img-fluid" />
            </div>
            <div className="col-6 box-content order-1 order-lg-0">
              <h4 className="section-subtitle">
                <span className="fw-bold">Partner Token Distribution</span>
              </h4>
              <p>
                Partner tokens reward Analysts for active participation;{" "}
                <span className="fw-bold">$METRIC</span> aligns incentives and
                enables participation.
              </p>
              <p className="d-none d-lg-block">
                <a
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  href="/docs/metricsdao-whitepaper-2022.pdf"
                >
                  LEARN MORE ABOUT THE $METRIC TOKEN{" "}
                  <i className="bi bi-arrow-right-short"></i>
                </a>
              </p>
            </div>
            <div className="col-12 box-actions-mobile order-3 order-lg-0">
              <p>
                <a
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  href="/docs/metricsdao-whitepaper-2022.pdf"
                >
                  LEARN MORE ABOUT THE $METRIC TOKEN{" "}
                  <i className="bi bi-arrow-right-short"></i>
                </a>
              </p>
            </div>
          </div> */}
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
    </>
  );
}

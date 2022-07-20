import { Link } from "remix";
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
              <p className="text-content">
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
              </p>
            </div>
            <div
              className="col-12"
              data-aos="fade"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <p className="text-center pt-5 mt-5 d-flex flex-md-row flex-column justify-content-center align-items-center">
                <a
                  href="/docs/metricsdao-whitepaper-2022.pdf"
                  className="btn btn-sm btn-outline-light rounded-pill px-3 mx-2 mb-4"
                >
                  READ THE WHITEPAPER{" "}
                  <i className="bi bi-arrow-right-short"></i>
                </a>
                <Link
                  to="/roadmap"
                  className="btn btn-sm btn-outline-light rounded-pill px-3 mx-2 mb-4"
                >
                  VIEW ROADMAP <i className="bi bi-arrow-right-short"></i>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-2" id="roadmap">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="row">
            <div
              className="col-12 text-center"
              data-aos="fade"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <h2 className="section-title">
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
              </h2>
            </div>
          </div>
        </div>
      </section>
      <section className="section-3">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="row section-creation">
            <div className="col-6 box-content">
              <h3 className="section-subtitle">
                <span className="fw-bold">Question Creation</span>
              </h3>
              <p>
                The analytical needs of DAOs are discovered and organized into
                Questions that can be addressed by Analysts. Effective
                prioritization, achieved through “upvoting,” helps center
                Analysts on addressing the right challenges at the right time.
              </p>
              <p>
                <a
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  href="https://bounty.metricsdao.xyz/"
                >
                  SUBMIT A QUESTION <i className="bi bi-arrow-right-short"></i>
                </a>
              </p>
            </div>
            <div
              className="col-6"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <img src="img/pic-creation.png" alt="" className="img-fluid" />
            </div>
          </div>
          <div className="row section-generation">
            <div
              className="col-6 order-1 order-lg-0"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <img src="img/pic-generation.png" alt="" className="img-fluid" />
            </div>
            <div className="col-6 box-content">
              <h4 className="section-subtitle">
                <span className="fw-bold">Solution Generation</span>
              </h4>
              <p>
                Analysts address questions with results, visualizations,
                insights, and further Questions that generate Solutions.
              </p>
              <p>
                <a
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  href="https://metricsdao.notion.site/metricsdao/Bounty-Programs-d4bac7f1908f412f8bf4ed349198e5fe"
                >
                  VIEW OPEN CHALLENGES{" "}
                  <i className="bi bi-arrow-right-short"></i>
                </a>
              </p>
            </div>
          </div>
          <div className="row section-review">
            <div className="col-6 box-content">
              <h4 className="section-subtitle">
                <span className="fw-bold">Solution Review</span>
              </h4>
              <p>
                Public feedback, as opposed to the private loops used in
                traditional analysis methods, ensures that a Solution meets data
                and delivery standards — does the Solution solve the challenge,
                and does it do it well.
              </p>
            </div>
            <div
              className="col-6"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <img src="img/pic-review.png" alt="" className="img-fluid" />
            </div>
          </div>
          <div className="row section-payment">
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
          </div>
        </div>
      </section>
      <section className="section-4" id="contactus">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="row">
            <div className="col-12 text-center">
              <p
                className="section-title my-5"
                data-aos="fade"
                data-aos-duration="1000"
              >
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
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="2000"
              >
                <a
                  className="btn-main-white"
                  href="https://partnerwith.metricsdao.xyz"
                >
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

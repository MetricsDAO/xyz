import Header from "~/components/Header";
import SocialIcons from "~/components/SocialIcons";

export default function LandingHeader() {
  return (
      <section className="hero-section">
        <section className="site-header">
          <div className="container">
            <Header />
            <section className="intro tw-text-center tw-h-screen lg:tw-h-auto tw-flex tw-flex-col tw-justify-center">
              <h1
                  className="section-title"
                  data-aos="fade"
                  data-aos-duration="1000"
              >
                {/* Uniting <strong>analytical minds</strong> to solve{" "}
                <br className="d-none d-lg-block" />
                the greatest challenges facing <br className="d-none d-lg-block" />
                blockchain ecosystems. */}
                <strong>On-Demand Data Analytics for Crypto Projects</strong>
              </h1>
              <div data-aos="fade" data-aos-delay="300" data-aos-duration="2000">
                <a className="btn-main" href="https://discord.gg/p3GMjK2zAr">
                  <span>JOIN</span>
                  <span>
                <i className="bi bi-arrow-right-short"></i>
              </span>
                </a>
              </div>
              <div className="tw-flex lg:tw-hidden tw-list-none tw-justify-center tw-absolute tw-w-full tw-left-0 tw-bottom-16">
                <SocialIcons/>
              </div>
            </section>
          </div>
        </section>
        <section className="tw-text-center tw-bg-white lg:tw-bg-transparent">
          <div className="container tw-flex tw-flex-col lg:tw-flex-row tw-gap-20 tw-py-24">
            <div className="feature tw-mx-6 lg:tw-mx-auto"
                 data-aos="fade"
                 data-aos-delay="300"
                 data-aos-duration="2000">
              <div className="feature-icon">
                <img src="img/equal.png" alt="" />
              </div>
              <p>
                We believe that{" "}
                <span className="fw-bold">equal access to on-chain data</span>,
                regardless of provider, is necessary to answer the most pressing
                questions for decentralized organizations.
              </p>
            </div>
            <div className="feature tw-mx-6 lg:tw-mx-auto"
                 data-aos="fade"
                 data-aos-delay="300"
                 data-aos-duration="2000">
              <div className="feature-icon">
                <img src="img/empowering.png" alt="" />
              </div>
              <p>
                We believe that{" "}
                <span className="fw-bold">empowering analysts</span>,
                irrespective of financial or geographic circumstance, will
                unleash groundbreaking solutions and innovations for the entire
                blockchain ecosystem.
              </p>
            </div>
            <div className="feature tw-mx-6 lg:tw-mx-auto"
                 data-aos="fade"
                 data-aos-delay="300"
                 data-aos-duration="2000">
              <div className="feature-icon">
                <img src="img/operating.png" alt="" />
              </div>
              <p>
                We believe that a{" "}
                <span className="fw-bold">
                  new operating system connecting DAOs with analysts
                </span>{" "}
                will fuel the Organized Power Usage needed to drive the next era
                of Web3 development.
              </p>
            </div>
          </div>
        </section>
      </section>
  );
};

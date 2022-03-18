export default function LandingHeader() {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
}

const DesktopHeader = () => {
  return (
    <section className="site-header">
      <div className="container">
        <header className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="col-md-4 d-flex align-items-center">
            <a
              href="/"
              className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
            >
              <img
                src="img/bw-lightbg@2x.png"
                alt="MetricsDAO"
                width="241"
                height="44"
              />
            </a>
          </div>
          <ul className="nav col-md-8 justify-content-end list-unstyled d-flex align-items-center">
            <a
              className="btn btn-outline-dark rounded-pill px-3 me-3"
              href="https://www.notion.so/metricsdao/MetricsDAO-Roadmap-09ce7d1f23a741b38f63587be59574a6"
            >
              ROADMAP
            </a>
            <a
              className="btn btn-outline-dark rounded-pill px-3 me-3 text-uppercase"
              href="https://docs.google.com/forms/d/e/1FAIpQLSdh5JDUp-7MSl-N-Mk_4hNWmGdNRkpcdhzuLMbSP0ef9f094Q/viewform"
            >
              Partner with Us
            </a>
            <li className="ms-2 social-network">
              <a
                className="btn btn-outline-dark"
                href="https://twitter.com/MetricsDAO"
              >
                <i className="bi bi-twitter"></i>
              </a>
            </li>
            <li className="ms-2 social-network">
              <a
                className="btn btn-outline-dark bi-mirror"
                href="https://metricsdao.mirror.xyz/"
              ></a>
            </li>
          </ul>
        </header>
        <section className="intro text-center">
          <h1
            className="section-title"
            data-aos="fade"
            data-aos-duration="1000"
          >
            Uniting <strong>analytical minds</strong> to solve{" "}
            <br className="d-none d-lg-block" />
            the greatest challenges facing <br className="d-none d-lg-block" />
            blockchain ecosystems.
          </h1>
          <div data-aos="fade" data-aos-delay="300" data-aos-duration="2000">
            <a className="btn-main" href="https://discord.gg/metrics">
              <span>JOIN</span>
              <span>
                <i className="bi bi-arrow-right-short"></i>
              </span>
            </a>
          </div>
          <div className="row g-4 pt-5 mt-4 row-cols-1 row-cols-lg-3">
            <div className="feature col">
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
            <div className="feature col">
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
            <div className="feature col">
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
      </div>
    </section>
  );
};

const MobileHeader = () => {
  return (
    <section className="site-header-mobile">
      <div className="bg-header-mobile">
        <div className="container h-100 d-flex flex-column justify-content-between align-items-between">
          <div className="col-12 d-flex align-items-center">
            <a href="/" className="mx-auto pt-5">
              <img
                src="img/bw-lightbg@2x.png"
                alt="MetricsDAO"
                width="241"
                height="44"
              />
            </a>
          </div>
          <section className="intro text-center">
            <h1
              className="section-title"
              data-aos="fade"
              data-aos-duration="1000"
            >
              Uniting <strong>analytical minds</strong> to solve{" "}
              <br className="d-none d-lg-block" />
              the greatest challenges facing{" "}
              <br className="d-none d-lg-block" />
              blockchain ecosystems.
            </h1>
            <div data-aos="fade" data-aos-delay="300" data-aos-duration="2000">
              <a className="btn-main" href="https://discord.gg/metrics">
                <span>JOIN</span>
                <span>
                  <i className="bi bi-arrow-right-short"></i>
                </span>
              </a>
            </div>
          </section>

          <header className="pb-5 d-flex flex-wrap justify-content-between align-items-center">
            <ul className="nav col-12 justify-content-end list-unstyled d-flex align-items-center justify-content-center">
              <a
                href="https://www.notion.so/metricsdao/MetricsDAO-Roadmap-09ce7d1f23a741b38f63587be59574a6"
                className="btn btn-outline-dark rounded-pill px-3 me-2"
              >
                ROADMAP
              </a>
              <a
                href="#contactus"
                className="btn btn-outline-dark rounded-pill px-3 me-2 text-uppercase"
              >
                Partner with Us
              </a>
              <li className="ms-0 social-network">
                <a
                  className="btn btn-outline-dark"
                  href="https://twitter.com/MetricsDAO"
                >
                  <i className="bi bi-twitter"></i>
                </a>
              </li>
              <li className="ms-2 social-network">
                <a
                  className="btn btn-outline-dark bi-mirror"
                  href="https://metricsdao.mirror.xyz/"
                ></a>
              </li>
            </ul>
          </header>
        </div>
      </div>
      <div className="bg-white">
        <div className="container">
          <section className="intro text-center">
            <div className="row g-xl-4 g-3 pt-5 mt-4 row-cols-1 row-cols-lg-3 px-4">
              <div
                className="feature col"
                data-aos="fade"
                data-aos-delay="300"
                data-aos-duration="2000"
              >
                <div className="feature-icon">
                  <img src="img/equal.png" alt="" />
                </div>
                <p>
                  We believe that{" "}
                  <span className="fw-bold">equal access to on-chain data</span>
                  , regardless of provider, is necessary to answer the most
                  pressing questions for decentralized organizations.
                </p>
              </div>
              <div
                className="feature col"
                data-aos="fade"
                data-aos-delay="300"
                data-aos-duration="2000"
              >
                <div className="feature-icon">
                  <img src="img/empowering.png" alt="" />
                </div>
                <p>
                  We believe that empowering analysts, irrespective of financial
                  or geographic circumstance, will unleash groundbreaking
                  solutions and innovations for the entire blockchain ecosystem.
                </p>
              </div>
              <div
                className="feature col"
                data-aos="fade"
                data-aos-delay="300"
                data-aos-duration="2000"
              >
                <div className="feature-icon">
                  <img src="img/operating.png" alt="" />
                </div>
                <p>
                  We believe that a new operating system connecting DAOs with
                  analysts will fuel the Organized Power Usage needed to drive
                  the next era of Web3 development.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

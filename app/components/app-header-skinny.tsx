import { Link } from "remix";

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
    <section className="site-header-skinny">
      <div className="container">
        <header className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="col-md-4 d-flex align-items-center">
            <Link
              to="/"
              className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
            >
              <img
                src="img/bw-lightbg@2x.png"
                alt="MetricsDAO"
                width="241"
                height="44"
              />
            </Link>
          </div>
          <ul className="nav col-md-8 justify-content-end list-unstyled d-flex align-items-center">
            <Link
              className="btn btn-outline-dark rounded-pill px-3 me-3"
              to="/roadmap"
            >
              ROADMAP
            </Link>
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
      </div>
    </section>
  );
};

const MobileHeader = () => {
  return (
    <section className="site-header-mobile">         
    </section>
  );
};

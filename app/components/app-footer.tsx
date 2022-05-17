import { Link } from "remix";

export default function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row d-flex flex-wrap justify-content-between align-items-center py-3 my-4">
          <div className="col-4 d-flex align-items-center">
            <Link to="/" className="footer-brand">
              <img src="img/black-mark@2x.png" alt="MetricsDAO" width="96" />
            </Link>
          </div>
          <ul className="nav col-auto justify-content-end list-unstyled d-flex flex-row flex-lg-column social-network">
            <li className="ms-3 mb-lg-3">
              <div className="d-flex flex-column flex-lg-row justify-content-start align-items-center">
                <a
                  className="btn btn-outline-dark"
                  href="https://twitter.com/MetricsDAO"
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <span className="ms-2 text-uppercase">twitter</span>
              </div>
            </li>
            <li className="ms-3 mb-lg-3">
              <div className="d-flex flex-column flex-lg-row justify-content-start align-items-center">
                <a
                  className="btn btn-outline-dark bi-mirror"
                  href="https://metricsdao.mirror.xyz/"
                ></a>
                <span className="ms-2 text-uppercase">mirror</span>
              </div>
            </li>
            <li className="ms-3 mb-lg-3">
              <div className="d-flex flex-column flex-lg-row justify-content-start align-items-center">
                <a
                  className="btn btn-outline-dark"
                  href="https://docs.metricsdao.xyz/"
                >
                  <i className="bi bi-book-half"></i>
                </a>
                <span className="ms-2 text-uppercase">docs</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@remix-run/react";
import { SocialIcons } from "./social-icons";

export default function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row d-flex flex-wrap justify-content-between align-items-center py-3 my-4">
          <div className="col-4 d-flex align-items-center">
            <Link to="/" className="footer-brand">
              <img src="/img/black-mark@2x.png" alt="MetricsDAO" width="96" />
            </Link>
          </div>
          <ul className="nav col-auto justify-content-end list-unstyled d-flex flex-row flex-lg-column social-network">
            <li className="mb-lg-3">
              <a
                href="https://twitter.com/MetricsDAO"
                className="d-flex flex-column flex-lg-row justify-content-start align-items-center text-black text-decoration-none"
              >
                <span className="btn btn-outline-dark">
                  <i className="bi bi-twitter"></i>
                </span>
                <span className="ms-md-2 text-uppercase">twitter</span>
              </a>
            </li>
            <li className="mb-lg-3">
              <a
                href="https://docs.metricsdao.xyz/"
                className="d-flex flex-column flex-lg-row justify-content-start align-items-center text-black text-decoration-none"
              >
                <span className="btn btn-outline-dark">
                  <i className="bi bi-file-earmark-text-fill"></i>
                </span>
                <span className="ms-md-2 text-uppercase">docs</span>
              </a>
            </li>
            <li className="mb-lg-3">
              <a
                href="https://discord.gg/p3GMjK2zAr"
                className="d-flex flex-column flex-lg-row justify-content-start align-items-center text-black text-decoration-none"
              >
                <span className="btn btn-outline-dark">
                  <i className="bi bi-discord"></i>
                </span>
                <span className="ms-md-2 text-uppercase">discord</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

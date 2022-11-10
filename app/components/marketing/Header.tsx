import { Link } from "@remix-run/react";
import { useRef } from "react";
import SocialIcons from "~/components/marketing/SocialIcons";

const Header = () => {
  const navRef = useRef<any>(null);
  const menuRef = useRef<any>(null);

  const toggleMenu = () => {
    let nav = navRef.current;
    let hamburger = menuRef.current;
    if (nav.classList.contains("nav-open")) {
      nav.classList.remove("nav-open");
      hamburger.classList.remove("hamburger-close");
    } else {
      nav.classList.add("nav-open");
      hamburger.classList.add("hamburger-close");
    }
  };

  return (
    <header className="flex flex-wrap justify-between items-center absolute lg:static w-full left-0">
      <div className="w-full lg:w-1/4 flex items-center justify-center lg:justify-start">
        <Link to="/" className="no-underline">
          <img src="/img/bw-lightbg@2x.png" alt="MetricsDAO" width="241" height="44" />
        </Link>
      </div>
      <div
        ref={menuRef}
        className="hamburger p-3 space-y-1 rounded shadow lg:hidden
             cursor-pointer absolute right-2"
        onClick={toggleMenu}
      >
        <span className="block w-6 h-0.5 bg-gray-600"></span>
        <span className="block w-6 h-0.5 bg-gray-600"></span>
        <span className="block w-6 h-0.5 bg-gray-600"></span>
      </div>
      <ul ref={navRef} className="nav w-3/4 justify-end list-none hidden lg:flex items-center">
        <a
          className="btn btn-outline-dark rounded-pill xl:px-4 lg:px-3 xl:mr-4 lg:mr-2 md:mr-1"
          href="https://blog.metricsdao.xyz/101/"
          rel="noreferrer"
        >
          BECOME AN ANALYST
        </a>
        <a
          className="btn btn-outline-dark rounded-pill xl:px-4 lg:px-3 xl:mr-4 lg:mr-2 md:mr-1"
          href="https://metricsdao.notion.site/Bounty-Programs-d4bac7f1908f412f8bf4ed349198e5fe"
        >
          BOUNTIES
        </a>
        <Link className="btn btn-outline-dark rounded-pill xl:px-4 lg:px-3 xl:mr-4 lg:mr-2 md:mr-1" to="/dashboard">
          DASHBOARD
        </Link>
        <Link className="btn btn-outline-dark rounded-pill xl:px-4 lg:px-3 xl:mr-4 lg:mr-2 md:mr-1" to="/showcase">
          SHOWCASE
        </Link>
        <a
          className="btn btn-outline-dark rounded-pill xl:px-4 lg:px-3 xl:mr-4 lg:mr-2 md:mr-1"
          href="https://metricsdao.ghost.io/"
        >
          BLOG
        </a>
        <Link
          className="btn btn-outline-dark rounded-pill xl:px-4 lg:px-3 xl:mr-4 lg:mr-2 md:mr-1 text-uppercase"
          to="/3-step-process"
        >
          Partner with Us
        </Link>
        <SocialIcons />
      </ul>
    </header>
  );
};

export default Header;

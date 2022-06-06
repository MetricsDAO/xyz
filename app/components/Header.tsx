import { Link } from "remix";
import { useRef } from 'react';
import SocialIcons from "~/components/SocialIcons";

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
        <header className="tw-flex tw-flex-wrap tw-justify-between tw-items-center tw-absolute lg:tw-static tw-w-full tw-left-0">
            <div className="tw-w-full lg:tw-w-1/4 tw-flex tw-items-center tw-justify-center lg:tw-justify-start">
                <Link
                    to="/"
                    className="tw-no-underline"
                >
                    <img
                        src="img/bw-lightbg@2x.png"
                        alt="MetricsDAO"
                        width="241"
                        height="44"
                    />
                </Link>
            </div>
            <div ref={menuRef} className="hamburger tw-p-3 tw-space-y-1 tw-rounded tw-shadow lg:tw-hidden
             tw-cursor-pointer tw-absolute tw-right-2" onClick={toggleMenu}>
                <span className="tw-block tw-w-6 tw-h-0.5 tw-bg-gray-600"></span>
                <span className="tw-block tw-w-6 tw-h-0.5 tw-bg-gray-600"></span>
                <span className="tw-block tw-w-6 tw-h-0.5 tw-bg-gray-600"></span>
            </div>
            <ul ref={navRef} className="nav tw-w-3/4 tw-justify-end tw-list-none tw-hidden lg:tw-flex tw-items-center">
                <Link
                    className="btn btn-outline-dark rounded-pill xl:tw-px-4 lg:tw-px-3 xl:tw-mr-4 lg:tw-mr-2 md:tw-mr-1"
                    to="/dashboard"
                >
                    DASHBOARD
                </Link>
                <Link
                    className="btn btn-outline-dark rounded-pill xl:tw-px-4 lg:tw-px-3 xl:tw-mr-4 lg:tw-mr-2 md:tw-mr-1"
                    to="/showcase"
                >
                    SHOWCASE
                </Link>
                <Link
                    className="btn btn-outline-dark rounded-pill xl:tw-px-4 lg:tw-px-3 xl:tw-mr-4 lg:tw-mr-2 md:tw-mr-1"
                    to="/roadmap"
                >
                    ROADMAP
                </Link>
                <a
                    className="btn btn-outline-dark rounded-pill xl:tw-px-4 lg:tw-px-3 xl:tw-mr-4 lg:tw-mr-2 md:tw-mr-1 text-uppercase"
                    href="https://partnerwith.metricsdao.xyz"
                >
                    Partner with Us
                </a>
                <a
                    className="btn btn-outline-dark rounded-pill xl:tw-px-4 lg:tw-px-3 xl:tw-mr-4 lg:tw-mr-2 md:tw-mr-1 text-uppercase"
                    href="https://metricsdao.substack.com/"
                >
                    Newsletter
                </a>
                <SocialIcons/>
            </ul>
        </header>
    )
}

export default Header;
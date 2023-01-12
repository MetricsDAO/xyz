import SocialIcons from "./social-icons";
import { Link } from "@remix-run/react";
import clsx from "clsx";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

const links = [
  { link: "https://app.gitbook.com/o/x38XyrjrJ4RgJMWHzzYs/s/mGWNhyjPX5PDPhIGxV81/", label: "Protocol" },
  { link: "https://docs.metricsdao.xyz/", label: "Docs" },
  { link: "https://discourse.metricsdao.xyz/", label: "Governance" },
  { link: "https://blog.metricsdao.xyz/", label: "Blog" },
  { link: "/partner", label: "Partner with Us" },
  { link: "https://blog.metricsdao.xyz/all-courses/", label: "Education" },
  { link: "/terms", label: "Terms & Privacy" },
];

type Variant = "gradient" | "transparent" | "circle";

export default function Footer({ variant = "gradient" }: { variant?: Variant }) {
  const items = links.map((link) => (
    <a key={link.link} href={link.link} className="block px-2 py-1.5 text-black">
      {link.label}
    </a>
  ));

  const currentYear = new Date().getFullYear();

  const styles = {
    gradient: "url(/img/marketing/footer-blur.png)",
    circle: "url(/img/marketing/footer-circle-blur.png)",
    transparent: "",
  };

  return (
    <footer
      id="bottom"
      className={clsx("whitespace-nowrap", {
        "bg-local bg-cover": variant === "gradient" || variant === "circle",
        "bg-none": variant === "transparent",
      })}
      style={{ backgroundImage: styles[variant] }}
    >
      <a
        href="/app/analyze"
        className="group flex flex-row items-center py-7 text-white text-8xl font-thin text-clip hover:font-bold overflow-clip backdrop-blur-sm"
      >
        <p>LAUNCH APP</p> <ArrowRightIcon className="h-10 w-8 mx-5 text-white shrink-0 group-hover:hidden" />
        <img
          src="/img/marketing/footer-rocket.png"
          alt=""
          className="h-10 w-8 mx-5 shrink-0 hidden group-hover:block group-hover:animate-[rotateLeft_500ms_linear_1]"
        />
        <p>LAUNCH APP</p>
        <ArrowRightIcon className="h-10 w-8 mx-5 text-white shrink-0 group-hover:hidden" />
        <img
          src="/img/marketing/footer-rocket.png"
          alt=""
          className="h-10 w-8 mx-5 shrink-0 hidden group-hover:block group-hover:animate-[rotateLeft_500ms_linear_1]"
        />
        <p>LAUNCH APP</p>
        <ArrowRightIcon className="h-10 w-8 mx-5 text-white shrink-0 group-hover:hidden" />
        <img
          src="/img/marketing/footer-rocket.png"
          alt=""
          className="h-10 w-8 mx-5 shrink-0 hidden group-hover:block group-hover:animate-[rotateLeft_500ms_linear_1]"
        />
        <p>LAUNCH APP</p>
        <ArrowRightIcon className="h-10 w-8 mx-5 text-white shrink-0 group-hover:hidden" />
        <img
          src="/img/marketing/footer-rocket.png"
          alt=""
          className="h-10 w-8 mx-5 shrink-0 hidden group-hover:block group-hover:animate-[rotateLeft_500ms_linear_1]"
        />
        <p>LAUNCH APP</p>
      </a>

      <div className="flex flex-col lg:flex-row gap-y-5 justify-between items-center p-4 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-x-3">
          <img src="/img/black-mark@2x.png" alt="MetricsDAO" width="34" />
          <span className="text-sm">© {currentYear} MetricsDAO</span>
        </Link>
        <menu className="flex flex-col md:flex-row items-center justify-between xl:gap-x-6 text-sm">{items}</menu>
        <SocialIcons />
      </div>
    </footer>
  );
}

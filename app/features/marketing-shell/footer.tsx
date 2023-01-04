import SocialIcons from "./social-icons";
import { Link } from "@remix-run/react";
import clsx from "clsx";

const links = [
  { link: "/protocol", label: "Protocol" },
  { link: "https://docs.metricsdao.xyz/", label: "Docs" },
  { link: "https://discourse.metricsdao.xyz/", label: "Governance" },
  { link: "https://blog.metricsdao.xyz/", label: "Blog" },
  { link: "/partner", label: "Partner with Us" },
  { link: "https://blog.metricsdao.xyz/all-courses/", label: "Education" },
  { link: "/terms", label: "Terms & Privacy" },
];

type Variant = "gradient" | "transparent";

export default function Footer({ variant = "gradient" }: { variant?: Variant }) {
  const items = links.map((link) => (
    <a key={link.link} href={link.link} className="block px-2 py-1.5 text-black">
      {link.label}
    </a>
  ));

  const currentYear = new Date().getFullYear();

  var imgUrl = "";

  if (variant === "gradient") {
    imgUrl = "url(/img/marketing/footer-blur.png)";
  }

  return (
    <footer
      id="bottom"
      className={clsx("whitespace-nowrap", {
        "bg-local bg-cover": variant === "gradient",
        "bg-none": variant === "transparent",
      })}
      style={{ backgroundImage: imgUrl }}
    >
      <a
        href="/app/ecosystem"
        className="block py-7 text-white text-8xl font-thin text-clip hover:font-bold overflow-clip backdrop-blur-sm"
      >
        LAUNCH APP LAUNCH APP LAUNCH APP LAUNCH APP LAUNCH APP
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

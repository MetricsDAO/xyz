import SocialIcons from "./SocialIcons";
import { Link } from "@remix-run/react";

const links = [
  { link: "/protocol", label: "Protocol" },
  { link: "https://docs.metricsdao.xyz/", label: "Docs" },
  { link: "https://discourse.metricsdao.xyz/", label: "Governance" },
  { link: "https://blog.metricsdao.xyz/", label: "Blog" },
  { link: "/partner", label: "Partner with Us" },
  { link: "https://blog.metricsdao.xyz/all-courses/", label: "Education" },
  { link: "/terms", label: "Terms & Privacy" },
];

export default function Footer() {
  const items = links.map((link) => (
    <a key={link.link} href={link.link} className="block px-2 py-1.5 text-black">
      {link.label}
    </a>
  ));

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="bottom"
      className="bg-local bg-cover whitespace-nowrap"
      style={{ backgroundImage: "url(/img/marketing/footer-blur.png)" }}
    >
      <a
        href="/app/ecosystem"
        className="block py-3 text-white text-8xl font-thin text-clip hover:font-bold overflow-clip"
      >
        LAUNCH APP LAUNCH APP LAUNCH APP LAUNCH APP LAUNCH APP
      </a>

      <div className="flex flex-col lg:flex-row gap-y-5 justify-between items-center p-3 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-x-3">
          <img src="/img/black-mark@2x.png" alt="MetricsDAO" width="38" />
          <span>© {currentYear} MetricsDAO</span>
        </Link>
        <menu className="flex flex-col md:flex-row items-center justify-between">{items}</menu>
        <SocialIcons />
      </div>
    </footer>
  );
}

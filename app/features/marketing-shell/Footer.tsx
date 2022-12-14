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
    <footer className="flex flex-col lg:flex-row gap-y-5 justify-between items-center p-3 my-4">
      <Link to="/" className="flex items-center gap-x-3">
        <img src="/img/black-mark@2x.png" alt="MetricsDAO" width="38" />
        <span>© {currentYear} MetricsDAO</span>
      </Link>
      <menu className="flex flex-col md:flex-row items-center gap-4 ml-4">{items}</menu>
      <SocialIcons />
    </footer>
  );
}

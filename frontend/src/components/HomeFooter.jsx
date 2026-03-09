import { Link } from "react-router-dom";
import { memo } from "react";
import { Github, Linkedin, Twitter, Globe, Mail } from "lucide-react";
import "../styles/home-footer.css";

const footerLinks = [
  { title: "Video Meetings", href: "/signup", internal: true },
  { title: "AI Interview", href: "/signup", internal: true },
  { title: "Pricing", href: "/pricing", internal: true },
  { title: "Activity", href: "/activity", internal: true },
  { title: "Help", href: "#", internal: false },
  { title: "About", href: "#", internal: false },
];

const icons = [
  { Icon: Github,   href: "#" },
  { Icon: Linkedin, href: "#" },
  { Icon: Twitter,  href: "#" },
  { Icon: Globe,    href: "#" },
  { Icon: Mail,     href: "#" },
];

function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-links">
        {footerLinks.map((link) =>
          link.internal ? (
            <Link key={link.title} to={link.href} className="home-footer-link">{link.title}</Link>
          ) : (
            <a key={link.title} href={link.href} className="home-footer-link">{link.title}</a>
          )
        )}
      </div>

      <div className="home-footer-icons">
        {icons.map(({ Icon, href }, i) => (
          <a key={i} href={href} className="home-footer-icon">
            <Icon size={20} />
          </a>
        ))}
      </div>

      <p className="home-footer-copy">
        © {new Date().getFullYear()} MeetPro. All rights reserved.
      </p>
    </footer>
  );
}

export default memo(HomeFooter);

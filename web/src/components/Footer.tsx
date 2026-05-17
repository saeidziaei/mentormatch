import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./icons";

type LinkGroup = {
  title: string;
  links: { label: string; href: string }[];
};

const linkGroups: LinkGroup[] = [
  {
    title: "Get to know us",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Contact Us", href: "#contact" },
      { label: "Safety & Trust", href: "#safety" },
      { label: "Reviews", href: "#reviews" },
      { label: "Blog", href: "#blog" },
    ],
  },
  {
    title: "Work with us",
    links: [
      { label: "Become a Tutor", href: "/tutor/onboard" },
      { label: "Tutor Login", href: "/signin" },
    ],
  },
  {
    title: "Learn with us",
    links: [
      { label: "Find a Tutor", href: "#find" },
      { label: "How It Works", href: "#how" },
      { label: "Study Resources", href: "#resources" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "#help" },
      { label: "FAQ", href: "#faq" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" },
    ],
  },
];

const socials = [
  { label: "Facebook", icon: FacebookIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "LinkedIn", icon: LinkedInIcon, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-indigo-950 px-6 py-14 text-indigo-100 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
        {linkGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-sm font-semibold text-white">{group.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-indigo-200/80 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-sm font-semibold text-white">Follow us</h4>
          <div className="mt-4 flex items-center gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-xs text-indigo-200/70">
            © {new Date().getFullYear()} MentorMatch.
            <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

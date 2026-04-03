import Link from "next/link";
import { Map, User, Info, Mail, Compass } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "#", icon: <Map size={20} /> },
  { name: "About", href: "#", icon: <Info size={20} /> },
  { name: "Contact", href: "#", icon: <Mail size={20} /> },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-moss-dark/80 text-white backdrop-blur-md border-b border-moss-muted flex items-center justify-between px-4">
      <Link
        href="/"
        className="flex items-center gap-2 transition-transform hover:scale-105"
      >
        <div className="bg-moss-muted p-1.5 rounded-lg shadow-[0_0_15px_rgba(162,255,134,0.2)]">
          <Compass className="w-5 h-5 text-moss-glow" />
        </div>
        <span className="text-xl font-blaack tracking-tight text-white">
          Pack<span className="text-moss-glow">Pal</span>
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-400 hover:text-moss-glow transition-colors flex items-center gap-1.5"
            >
              <span className="opacity-70 group-hover:opacity-100 group-hover:text-moss-glow">
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 p-1 pr-3 rounded-full border border-moss-muted hover:bg-moss-muted/30 transition-all shadow-sm">
            <div className="w-8 h-8 bg-moss-darkest rounded-full flex items-center justify-center border border-moss-muted group-hover:border-moss-glow">
              <User className="w-4 h-4 text-moss-accent group-hover:text-moss-glow transition-colors" />
            </div>
            <span className="text-sm font-semibold text-slate-300">
              Profile
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

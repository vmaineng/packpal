import Link from "next/link";
import { Map, User, Info, Mail, Compass } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "#", icon: <Map size={20} /> },
  { name: "About", href: "#", icon: <Info size={20} /> },
  { name: "Contact", href: "#", icon: <Mail size={20} /> },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-white/80 text-white backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4">
      <Link
        href="/"
        className="flex items-center gap-2 transition-transform hover:scale-105"
      >
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-blaack tracking-tight text-slate-900">
          Pack<span className="text-blue-600">Pal</span>
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">
              Profile
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

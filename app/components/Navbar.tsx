import Link from "next/link";
import { Map, User, Info, Mail, Compass } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-gray-800 text-white flex items-center justify-between px-4">
      <div className="text-lg font-bold">PackPal</div>
      <div className="space-x-4">
        <a href="#" className="hover:text-gray-400">
          Home
        </a>
        <a href="#" className="hover:text-gray-400">
          About
        </a>
        <a href="#" className="hover:text-gray-400">
          Contact
        </a>
      </div>
      <div>Profile</div>
    </nav>
  );
}

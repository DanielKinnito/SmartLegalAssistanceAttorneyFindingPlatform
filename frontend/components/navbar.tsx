import Link from "next/link";
import React from "react"; // Import React for React.FC

// Define the props interface for the Navbar component
interface NavbarProps {
  signinPath?: string; // signinPath is an optional string prop
}

const Navbar: React.FC<NavbarProps> = ({ signinPath }) => {
  return (
    <nav className="relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-white">🏛️</span>
          {/* Removed <a> tag inside Link, applied className directly to Link */}
          <Link
            href="/"
            className="text-xl font-bold text-white cursor-pointer"
          >
            LawConnect
          </Link>
        </div>
        <div className="hidden md:flex space-x-8">
          {/* Removed <a> tags inside Link, applied className directly to Link */}
          <Link href="/" className="text-white hover:text-gray-300 transition">
            Home
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-gray-300 transition"
          >
            About
          </Link>
          <Link
            href="/services"
            className="text-white hover:text-gray-300 transition"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-gray-300 transition"
          >
            Contact
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* Use the signinPath prop for the Login link, passHref no longer strictly needed for button child in modern Link */}
          {signinPath && (
            <Link href={signinPath}>
              <button className="text-white border border-[#CBB26A] px-4 py-2 rounded hover:bg-[#CBB26A] transition">
                Login
              </button>
            </Link>
          )}
          <button className="md:hidden text-white focus:outline-none">
            {/* Mobile menu icon */}☰
          </button>
        </div>
      </div>
      {/* Mobile menu (hidden by default) */}
      <div className="md:hidden absolute top-full left-0 w-full bg-[#101726] pb-4">
        <ul className="flex flex-col items-center space-y-4">
          {/* Removed <a> tags inside Link, applied className directly to Link */}
          <li>
            <Link
              href="/"
              className="text-white hover:text-gray-300 transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-white hover:text-gray-300 transition"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className="text-white hover:text-gray-300 transition"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-white hover:text-gray-300 transition"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

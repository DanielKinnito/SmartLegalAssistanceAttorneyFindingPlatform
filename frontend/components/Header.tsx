"use client"; // If using Next.js App Router, ensure this is a Client Component

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react"; // Assuming you're using lucide-react for icons
import logo from "../public/assets/logo.png"; // Ensure this path is correct

export default function Header() {
  const [activeLink, setActiveLink] = useState("/Client"); // Default active link
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userLastName, setUserLastName] = useState<string>("");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to handle clicks outside

  // Effect to retrieve user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const firstName = localStorage.getItem("user_first_name");
      const lastName = localStorage.getItem("user_last_name");
      const image = localStorage.getItem("user_image");

      if (firstName) setUserFirstName(firstName);
      if (lastName) setUserLastName(lastName);
      if (image) setUserImage(image);
    }
  }, []);

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Function to handle link click
  const handleLinkClick = (href: string) => {
    setActiveLink(href);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("user_first_name");
    localStorage.removeItem("user_last_name");
    localStorage.removeItem("user_image");
    localStorage.removeItem("access_token"); // Clear auth token if used
    router.push("/signin"); // Redirect to the sign-in page
  };

  // Function to toggle dropdown on click
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Navigation links array for DRY code (Profile link removed)
  const navLinks = [
    { href: "/common/law-search", label: "Law Search" },
    { href: "/Client", label: "Find Attorney" },
    { href: "/common/AI-ChatBot", label: "AI Bot" },
    { href: "/Client/legal-requests", label: "Legal Requests" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e2e45] text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="LegalConnect Logo"
            width={24}
            height={24}
            className="mr-1"
            style={{ objectFit: 'contain' }}
          />
          <span className="font-semibold text-lg">LegalConnect</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => handleLinkClick(link.href)}
              className={`text-white/80 hover:text-white transition-colors ${
                activeLink === link.href
                  ? "font-medium underline underline-offset-4"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDropdown} // Toggle dropdown on click
          >
            {/* Profile Picture */}
            {userImage ? (
              <Image
                src={userImage}
                alt="User Profile"
                width={32}
                height={32}
                className="rounded-full object-cover w-8 h-8 border border-gray-400"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                <span className="text-white">
                  {userFirstName.charAt(0) + (userLastName.charAt(0) || "")}
                </span>
              </div>
            )}
            {/* User Name */}
            <span className="bg-[#29374a] rounded-full py-1 px-3 text-sm flex items-center hover:bg-gray-700 transition-colors">
              {userFirstName || "Guest"} {userLastName}
            </span>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e2e45] text-white rounded-lg shadow-lg border border-gray-700">
              <div className="p-2">
                <p className="text-sm text-gray-300 px-2 py-1">
                  {userFirstName && userLastName
                    ? `${userFirstName} ${userLastName}`
                    : "Guest User"}
                  <br />
                  {localStorage.getItem("user_email") || "No email"}
                </p>
                <Link
                  href="/Client/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded flex items-center"
                >
                  <span className="mr-2">👤</span> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded flex items-center text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

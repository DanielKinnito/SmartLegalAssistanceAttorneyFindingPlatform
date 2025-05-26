"use client"; // If using Next.js App Router, ensure this is a Client Component

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/assets/logo.png"; // Ensure this path is correct

export default function Header() {
  // State to track the active link
  const [activeLink, setActiveLink] = useState("/Client"); // Default active link
  // State to store the user's first name
  const [userFirstName, setUserFirstName] = useState<string>("");
  // State to store the user's last name
  const [userLastName, setUserLastName] = useState<string>("");
  // State to store the user's image URL (if available)
  const [userImage, setUserImage] = useState<string | null>(null);

  // Effect to retrieve user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure localStorage is available (client-side)
      const firstName = localStorage.getItem("user_first_name");
      const lastName = localStorage.getItem("user_last_name");
      const image = localStorage.getItem("user_image");

      if (firstName) {
        setUserFirstName(firstName);
      }
      if (lastName) {
        setUserLastName(lastName);
      }
      if (image) {
        setUserImage(image);
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle link click
  const handleLinkClick = (href: string) => {
    setActiveLink(href);
  };

  // Navigation links array for DRY code
  const navLinks = [
    { href: "/common/law-search", label: "Law Search" },
    { href: "/Client", label: "Find Attorney" },
    { href: "/common/ai-bot", label: "AI Bot" },
    { href: "/Client/legal-requests", label: "Legal Requests" },
    { href: "/Client/profile", label: "Profile" }, // Added Profile link
  ];

  return (
    <header className="bg-[#1e2e45] text-white py-4 px-6">
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

        <div className="flex items-center space-x-2">
          {" "}
          {/* Changed to space-x-2 for spacing between image and name div */}
          {/* Profile Picture */}
          {userImage ? (
            <img
              src={userImage}
              alt="User Profile"
              width={32} // Increased size slightly for better visibility
              height={32} // Increased size slightly
              className="rounded-full object-cover w-8 h-8 border border-gray-400" // Added border for distinction
            />
          ) : (
            // Placeholder if no image (e.g., a simple white circle or an icon)
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
              {/* You could put an icon here, e.g., <UserIcon className="w-5 h-5" /> */}
              <span className="text-white">JD</span>{" "}
              {/* Placeholder initials */}
            </div>
          )}
          {/* User Name */}
          <Link
            href="/Client/profile"
            className="bg-[#29374a] rounded-full py-1 px-3 text-sm flex items-center hover:bg-gray-700 transition-colors"
          >
            <span>
              {userFirstName || "Guest"} {userLastName}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

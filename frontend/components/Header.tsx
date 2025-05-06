'use client'; // If using Next.js App Router, ensure this is a Client Component

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/assets/logo.png'

export default function Header() {
  // State to track the active link
  const [activeLink, setActiveLink] = useState('/Client'); // Default active link

  // Function to handle link click
  const handleLinkClick = (href: string) => {
    setActiveLink(href);
  };

  // Navigation links array for DRY code
  const navLinks = [
    { href: '/common/law-search', label: 'Law Search' },
    { href: '/Client', label: 'Find Attorney' },
    { href: '/common/ai-bot', label: 'AI Bot' },
    { href: '/Client/legal-requests', label: 'Legal Requests' },
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
                  ? 'font-medium underline underline-offset-4'
                  : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <div className="bg-[#29374a] rounded-full p-1.5 mr-2">
            <div className="w-5 h-5 rounded-full bg-white"></div>
          </div>
          <div className="bg-[#29374a] rounded-full py-1 px-3 text-sm flex items-center">
            <span>John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
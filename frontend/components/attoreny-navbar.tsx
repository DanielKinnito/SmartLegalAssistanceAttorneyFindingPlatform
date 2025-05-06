'use client';

import Image from 'next/image';
import Link from 'next/link';

const attorenyNavbar = () => {
  return (
    <header className="bg-[#1e2e45] text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Branding */}
        <div className="flex items-center space-x-2">
          <Image
            src="/placeholder.svg?height=24&width=24"
            alt="LegalConnect Logo"
            width={24}
            height={24}
            className="mr-1"
          />
          <span className="font-semibold text-lg">LegalConnect</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/Client/law-search" className="text-white/80 hover:text-white">
            Law Search
          </Link>
          <Link href="/Client" className="text-white font-medium underline underline-offset-4">
            Find Attorney
          </Link>
          <Link href="/client/ai-bot" className="text-white/80 hover:text-white">
            AI Bot
          </Link>
          <Link href="/client/legal-requests" className="text-white/80 hover:text-white">
            Legal Requests
          </Link>
        </nav>

        {/* Profile Section */}
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
};

export default attorenyNavbar;

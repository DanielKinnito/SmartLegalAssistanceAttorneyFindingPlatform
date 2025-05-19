'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string): string => {
    return pathname === path ? 'text-[#CBB26A] border-b border-[#CBB26A] pb-1' : 'hover:text-gray-300';
  };

  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-6">
      <div className="flex items-center gap-2">
        <span className="text-2xl text-white">🏛️</span>
        <span className="text-xl font-bold text-white">LawConnect</span>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex gap-8 text-white text-base font-medium">
          <Link href="/" className={isActive('/')}>Home</Link>
          <Link href="/Aboutus" className={isActive('/Aboutus')}>About</Link>
          <Link href="/Services" className={isActive('/Services')}>Services</Link>
          <Link href="/ContactUs" className={isActive('/ContactUs')}>Contact Us</Link>
        </div>
        <div className="flex items-center gap-4 ml-8">
          <Link href="/login" className="bg-transparent border border-[#CBB26A] text-sm px-4 py-1 text-[#CBB26A] hover:text-gray-300 font-medium">Login</Link>
          <Link href="/register" className="bg-[#CBB26A] text-white text-sm px-4 py-1 rounded font-medium hover:bg-[#bfa14e] transition">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
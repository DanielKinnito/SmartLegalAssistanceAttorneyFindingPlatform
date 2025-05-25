'use client';

import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import FloatingButton from '@/app/components/FloatingButton';

export default function ContactUsPage() {
  return (
    <main className="bg-white min-h-screen font-serif">
      <FloatingButton />
      {/* Hero Section */}
      <section className="relative h-[380px] md:h-[420px] flex flex-col justify-between">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/aboutusbackground.png"
            alt="Justice Statue"
            fill
            className="object-cover w-full h-full"
            style={{ zIndex: 0 }}
            priority
          />
          <div className="absolute inset-0 bg-[#232b36] opacity-80" />
        </div>
        {/* Top bar: logo and nav */}
        <div className="relative z-10">
          <Navbar />
        </div>
        {/* Title, divider, and description */}
        <div className="relative z-10 flex flex-col md:flex-row items-center max-w-5xl mx-auto px-8 mt-8 h-full">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-0 leading-tight">Contact us</h1>
          </div>
          <div className="h-32 w-px bg-white mx-8 hidden md:block" />
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie pellentesque urna libero velit porta. Velit pellentesque hac gravida pellentesque est semper. Duis lectus gravida
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Contact Form */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <form className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block font-semibold mb-2">First Name*</label>
                  <input type="text" placeholder="Enter first name" className="w-full border border-gray-400 px-4 py-2 focus:outline-none" required />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold mb-2">Last Name*</label>
                  <input type="text" placeholder="Enter last email" className="w-full border border-gray-400 px-4 py-2 focus:outline-none" required />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block font-semibold mb-2">Your Phone*</label>
                  <input type="text" placeholder="Enter your phone" className="w-full border border-gray-400 px-4 py-2 focus:outline-none" required />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold mb-2">Your Email*</label>
                  <input type="email" placeholder="Enter your email" className="w-full border border-gray-400 px-4 py-2 focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Message <span className="text-gray-500 text-sm">(optional)</span></label>
                <textarea placeholder="Enter message" className="w-full border border-gray-400 px-4 py-2 h-28 focus:outline-none" />
              </div>
              <button type="submit" className="bg-[#232b36] text-white px-8 py-2 font-semibold mt-2 hover:bg-[#1a232e] transition">Send Message</button>
            </form>
          </div>
          {/* Map */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-[400px] rounded-md overflow-hidden border border-gray-300">
              <iframe
                title="LawConnect Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://www.openstreetmap.org/export/embed.html?bbox=-80.2200%2C25.7800%2C-80.2100%2C25.7900&amp;layer=mapnik&amp;marker=25.7850,-80.2150"
              ></iframe>
            </div>
          </div>
        </div>
        {/* Contact Info Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-12 text-[#232b36] text-base">
          <div className="flex items-center gap-2">
            <span className="text-xl">📞</span>
            <span>+22 7272 8282</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <span>+7889 Mechanic Rd.Miami, Fl. 33125</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✉️</span>
            <span>northmanlaw@domain.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⏰</span>
            <span>07.00 am - 09.00 pm</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a232e] text-white pt-16 pb-8 mt-12">
        {/* Logo and divider */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏛️</span>
            <span className="font-semibold text-lg">LawConnect</span>
          </div>
          <hr className="w-full max-w-4xl border-gray-500 my-4" />
        </div>
        {/* Columns */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* About Us */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold mb-1">About Us</h4>
            <p className="text-sm text-gray-300">Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie.</p>
            <div className="flex gap-3 mt-2">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          {/* Services */}
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Business Law</li>
              <li>Education Law</li>
              <li>Legal Consultant</li>
              <li>General Lawyer</li>
            </ul>
          </div>
          {/* Page */}
          <div>
            <h4 className="font-semibold mb-3">Page</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Lawyer</li>
              <li>Appointment</li>
              <li>Documentation</li>
              <li>Cases</li>
              <li>News</li>
            </ul>
          </div>
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Links</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Term of use</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          {/* Contact Us */}
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li><span className="mr-2">📞</span>+251 11 67 54 33</li>
              <li><span className="mr-2">📍</span>Addis Ababa, Ethiopia</li>
              <li><span className="mr-2">✉️</span>lawconnect@gmail.com</li>
            </ul>
          </div>
        </div>
        <hr className="w-full max-w-6xl mx-auto border-gray-700 my-4" />
        <div className="text-center text-xs text-gray-400">
          Copyright &copy;2025 LawConnect All Right Reserved
        </div>
      </footer>
    </main>
  );
}

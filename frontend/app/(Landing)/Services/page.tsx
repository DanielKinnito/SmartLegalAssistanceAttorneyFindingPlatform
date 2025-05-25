'use client'

import Image from 'next/image'
import Navbar from '@/app/components/Navbar'
import FloatingButton from '@/app/components/FloatingButton'

export default function ServicesPage() {
  return (
    <main className="bg-white text-[#222]">
      <FloatingButton />
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex flex-col justify-between">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/aboutusbackground.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#232b36] opacity-80" />
        </div>
        {/* Top bar: logo and nav */}
        <div className="relative z-10">
          <Navbar />
        </div>
        {/* Title and description */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 md:py-24 w-full">
          <h1 className="text-white text-5xl md:text-6xl font-bold md:mb-0 mb-8 md:text-left w-full md:w-1/2">Services Detail</h1>
          <div className="h-32 w-px bg-white/30 mx-8 hidden md:block" />
          <p className="text-white text-base md:text-lg max-w-md md:text-right w-full md:w-1/2">
            Discover our comprehensive range of legal services designed to meet your needs. From corporate law to family matters, our expert attorneys provide personalized solutions and guidance.
          </p>
        </div>
      </section>

      {/* Legal Lawyer Process */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Our Legal Process</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center mx-4">
            <div className="bg-[#1a232e] w-32 h-32 flex items-center justify-center mb-6">
              <Image src="/jury.png" alt="Initial Consultation" width={64} height={64} />
            </div>
            <h3 className="font-semibold text-lg mt-2">Initial Consultation</h3>
            <p className="text-gray-600 text-sm text-center mt-2">Free first meeting to understand your case</p>
          </div>
          {/* Arrow */}
          <div className="hidden md:block mx-2">
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="12" x2="50" y2="12" stroke="#1a232e" strokeWidth="2" />
              <polygon points="50,6 60,12 50,18" fill="#1a232e" />
            </svg>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center mx-4">
            <div className="bg-[#1a232e] w-32 h-32 flex items-center justify-center mb-6">
              <Image src="/agreement.png" alt="Case Assessment" width={64} height={64} />
            </div>
            <h3 className="font-semibold text-lg mt-2">Case Assessment</h3>
            <p className="text-gray-600 text-sm text-center mt-2">Detailed analysis of your legal situation</p>
          </div>
          {/* Arrow */}
          <div className="hidden md:block mx-2">
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="12" x2="50" y2="12" stroke="#1a232e" strokeWidth="2" />
              <polygon points="50,6 60,12 50,18" fill="#1a232e" />
            </svg>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center mx-4">
            <div className="bg-[#1a232e] w-32 h-32 flex items-center justify-center mb-6">
              <Image src="/computer.png" alt="Strategy Development" width={64} height={64} />
            </div>
            <h3 className="font-semibold text-lg mt-2">Strategy Development</h3>
            <p className="text-gray-600 text-sm text-center mt-2">Customized legal approach for your case</p>
          </div>
          {/* Arrow */}
          <div className="hidden md:block mx-2">
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="12" x2="50" y2="12" stroke="#1a232e" strokeWidth="2" />
              <polygon points="50,6 60,12 50,18" fill="#1a232e" />
            </svg>
          </div>
          {/* Step 4 */}
          <div className="flex flex-col items-center mx-4">
            <div className="bg-[#1a232e] w-32 h-32 flex items-center justify-center mb-6">
              <Image src="/hammer.png" alt="Legal Representation" width={64} height={64} />
            </div>
            <h3 className="font-semibold text-lg mt-2">Legal Representation</h3>
            <p className="text-gray-600 text-sm text-center mt-2">Expert advocacy in court and negotiations</p>
          </div>
        </div>
      </section>

      {/* Professional Legal Lawyer */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold mb-16 text-left">Our Expert Legal Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-b border-gray-300">
          {/* Card 1 */}
          <div className="flex flex-col items-center py-12 border-r border-gray-300">
            <Image src="/desy.png" alt="Sarah Johnson" width={280} height={340} className="object-cover mb-8" />
            <h3 className="font-semibold text-2xl mb-2">Sarah Johnson</h3>
            <p className="text-gray-500 text-base">Corporate Law Specialist</p>
            <p className="text-gray-600 text-sm text-center mt-2">15+ years of experience in corporate law and mergers</p>
          </div>
          {/* Card 2 */}
          <div className="flex flex-col items-center py-12 border-r border-gray-300">
            <Image src="/nada.png" alt="Michael Chen" width={280} height={340} className="object-cover mb-8" />
            <h3 className="font-semibold text-2xl mb-2">Michael Chen</h3>
            <p className="text-gray-500 text-base">Intellectual Property Attorney</p>
            <p className="text-gray-600 text-sm text-center mt-2">Expert in patents, trademarks, and copyright law</p>
          </div>
          {/* Card 3 */}
          <div className="flex flex-col items-center py-12">
            <Image src="/lucas.png" alt="Emily Rodriguez" width={280} height={340} className="object-cover mb-8" />
            <h3 className="font-semibold text-2xl mb-2">Emily Rodriguez</h3>
            <p className="text-gray-500 text-base">Family Law Specialist</p>
            <p className="text-gray-600 text-sm text-center mt-2">Dedicated to helping families through legal challenges</p>
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
            <p className="text-sm text-gray-300">LawConnect provides expert legal services with a focus on client satisfaction and successful outcomes. Our team of experienced attorneys is dedicated to protecting your rights and interests.</p>
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
              <li>Corporate Law</li>
              <li>Family Law</li>
              <li>Intellectual Property</li>
              <li>Criminal Defense</li>
              <li>Real Estate Law</li>
            </ul>
          </div>
          {/* Page */}
          <div>
            <h4 className="font-semibold mb-3">Page</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Find a Lawyer</li>
              <li>Book Consultation</li>
              <li>Legal Resources</li>
              <li>Case Studies</li>
              <li>Legal Blog</li>
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
  )
}
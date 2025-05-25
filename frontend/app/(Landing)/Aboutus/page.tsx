'use client';

import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import FloatingButton from '@/app/components/FloatingButton';

export default function About() {
  return (
    <div className="bg-white min-h-screen font-serif">
      <FloatingButton />
      {/* Hero/Header Section with Background Image */}
      <div className="relative h-[420px] md:h-[500px] lg:h-[540px]">
        {/* Background Image */}
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

        {/* Navbar */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-row items-center h-full max-w-5xl mx-auto px-8 mt-8">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-0 leading-tight">About Us</h1>
          </div>
          <div className="h-32 w-px bg-white/30 mx-8 hidden md:block" />
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md">
              We are a team of dedicated legal professionals committed to providing accessible, high-quality legal services. Our mission is to connect individuals and businesses with expert attorneys who can help navigate complex legal challenges.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Helping Section */}
        <section className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <div className="md:w-1/2 border-r border-gray-300 pr-8">
            <div className="mb-2 text-sm text-gray-500 font-semibold">About Us</div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Empowering Justice<br />Through Expert<br />Legal Guidance<br />and Support
            </h2>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-[320px] h-[320px] bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
              <Image src="/silver_law.png" alt="Lady Justice" width={320} height={320} className="object-cover" />
            </div>
          </div>
        </section>
        <div className="text-center text-gray-700 text-sm max-w-3xl mx-auto mb-12">
          At LawConnect, we believe that access to quality legal representation should be available to everyone. Our platform brings together experienced attorneys from various practice areas, ensuring that clients can find the right legal expertise for their specific needs. We combine traditional legal expertise with modern technology to create a seamless experience for both clients and attorneys.
          <br /><br />
          Our team of legal professionals is dedicated to providing personalized attention and strategic solutions. We understand that legal matters can be complex and stressful, which is why we strive to make the process as smooth and transparent as possible. Whether you&apos;re facing a business dispute, family matter, or criminal case, our platform connects you with attorneys who have the experience and expertise to handle your situation effectively.
        </div>

        {/* Welcome Message Section */}
        <section className="flex flex-col md:flex-row gap-8 items-center mb-16">
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
            <div className="w-[180px] h-[180px] rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image src="/about.png" alt="Lawyer" width={180} height={180} className="object-cover" />
            </div>
          </div>
          <div className="md:w-2/3 pl-0 md:pl-8">
            <div className="mb-2 text-sm text-gray-500 font-semibold">Welcome Message</div>
            <h3 className="text-3xl font-bold mb-4 leading-tight">Welcome to<br />LawConnect -<br />Your Legal Partner</h3>
            <div className="text-gray-700 text-sm">
              Founded with a vision to revolutionize legal services, LawConnect has grown into a trusted platform connecting clients with top-tier legal professionals. Our commitment to excellence and client satisfaction has made us a leading name in legal services.
              <br /><br />
              We understand that legal matters can be overwhelming, which is why we&apos;ve created a platform that simplifies the process of finding and working with qualified attorneys. Our team of experienced lawyers brings decades of combined experience across various practice areas, ensuring that you receive expert guidance tailored to your specific needs.
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="flex flex-col md:flex-row gap-12 justify-between mt-12 border-t border-gray-200 pt-12">
          <div className="md:w-1/2 pr-8 border-r border-gray-200">
            <h4 className="text-3xl font-bold mb-4">Our Vision</h4>
            <div className="text-gray-700 text-sm">
              To be the most trusted and accessible legal platform, connecting individuals and businesses with expert legal representation. We envision a future where quality legal services are accessible to everyone, regardless of their background or circumstances.
              <br /><br />
              We strive to transform the legal industry through innovation and technology, making legal services more efficient, transparent, and client-focused. Our vision extends beyond just providing legal services - we aim to empower people with knowledge and support to navigate their legal challenges with confidence.
            </div>
          </div>
          <div className="md:w-1/2 pl-8">
            <h4 className="text-3xl font-bold mb-4">Our Mission</h4>
            <div className="text-gray-700 text-sm">
              To provide accessible, high-quality legal services through a platform that connects clients with experienced attorneys. We are committed to ensuring that everyone has access to expert legal representation when they need it most.
              <br /><br />
              Our mission is to simplify the legal process, making it more transparent and less intimidating for our clients. We work tirelessly to match clients with attorneys who have the right expertise and experience for their specific legal needs, ensuring the best possible outcomes for every case.
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#232b36] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">About Us</h4>
              <p className="text-gray-400 text-sm mb-4">
                LawConnect is your trusted partner in legal matters, connecting you with experienced attorneys who can help navigate complex legal challenges with confidence and expertise.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Corporate Law</li>
                <li>Family Law</li>
                <li>Intellectual Property</li>
                <li>Criminal Defense</li>
                <li>Real Estate Law</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Pages</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Find a Lawyer</li>
                <li>Book Consultation</li>
                <li>Legal Resources</li>
                <li>Case Studies</li>
                <li>Legal Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📞 +251 117 04 33</li>
                <li>📍 Addis Ababa, Ethiopia</li>
                <li>📧 lawconnect@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2025 LawConnect. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Use</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
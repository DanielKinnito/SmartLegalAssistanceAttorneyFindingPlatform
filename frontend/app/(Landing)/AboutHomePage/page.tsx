import Image from 'next/image';
import Navbar from '../../components/Navbar';
import FloatingButton from '../../components/FloatingButton';

const partners = [
  { name: 'Daerazo', icon: '/daerazo.png' },
  { name: 'Miguxian', icon: '/miguzian.png' },
  { name: 'Jennilyn', icon: '/jeni.png' },
  { name: 'Superanzo', icon: '/super.png' },
];

const lawyers = [
  { name: 'Desy Willy', title: 'Senior Lawyer', img: '/desy.png' },
  { name: 'Lucas Alex', title: 'Senior Business Lawyer', img: '/lucas.png' },
  { name: 'Natasha July', title: 'Senior Business Lawyer', img: '/natasha.png' },
  { name: 'Nada Geo', title: 'Senior Business Lawyer', img: '/nada.png' },
];

const news = [
  { title: '23 Cases Have Been Handled Successfully', img: '/news1.png', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', link: '#' },
  { title: '23 Cases Have Been Handled Successfully', img: '/news2.png', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', link: '#' },
  { title: '23 Cases Have Been Handled Successfully', img: '/news3.png', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', link: '#' },
];

export default function Home() {
  return (
    <div className="font-serif bg-white">
      <FloatingButton />
      {/* Hero Section - Updated to match reference image */}
      <div className="bg-[#101726] relative overflow-hidden">
        <Navbar />
        <div className="max-w-7xl h-[85vh] mx-auto flex flex-col md:flex-row items-center px-6 py-16 relative z-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Uphold Truth For<br />Justice With LawConnect
            </h1>
            
            <button className="bg-[#CBB26A] text-white px-8 py-3 rounded font-semibold shadow hover:bg-[#bfa14e] transition">Get Started</button>
          </div>
          <div className="flex-1 flex justify-end mt-10 md:mt-0">
            <Image 
              src="/home_law.png" 
              alt="Lady Justice" 
              width={500} 
              height={500} 
              className="rounded-lg shadow-lg object-contain transform translate-x-10" 
            />
          </div>
        </div>
      </div>

      {/* Lawyers Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Professional Lawyers And Advisors With More Experience</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {lawyers.map((lawyer, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <Image src={lawyer.img} alt={lawyer.name} width={150} height={150} className="rounded-full mb-4 object-cover" />
              <div className="font-bold text-lg">{lawyer.name}</div>
              <div className="text-gray-500">{lawyer.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services/Info Split Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">Helping To Overcome And Ease The Legal Burden</h3>
          <p className="mb-6 text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.
          </p>
          <button className="bg-[#101726] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#232b36] transition">See detail</button>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/seedetail.png" alt="Lady Justice" width={400} height={400} className="rounded-lg object-contain" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <Image src="/decision.png" alt="Gavel" width={400} height={250} className="rounded-lg object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">Professional Services Prepared To Be Your Lawyer Firm</h3>
          <p className="mb-6 text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center justify-between border-b py-2">
              <span>Education Lawyer & Consultation</span>
              <span className="text-[#CBB26A]">→</span>
            </li>
            <li className="flex items-center justify-between border-b py-2">
              <span>Business Law</span>
              <span className="text-[#CBB26A]">→</span>
            </li>
            <li className="flex items-center justify-between border-b py-2">
              <span>Education Lawyer & Consultation</span>
              <span className="text-[#CBB26A]">→</span>
            </li>
            <li className="flex items-center justify-between border-b py-2">
              <span>Business Law</span>
              <span className="text-[#CBB26A]">→</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Partnerships */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-center mb-8">Our Partnership</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((p, i) => (
            <div key={i} className="flex flex-col items-center">
              <Image src={p.icon} alt={p.name} width={80} height={80} />
              <div className="mt-2 font-semibold">{p.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Lawyer Section */}
      <section className="bg-[#101726] py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold text-white mb-4">We Help You With Quality Legal Lawyer</h3>
          <p className="text-white/80 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.
          </p>
          <button className="bg-[#CBB26A] text-white px-8 py-3 rounded font-semibold shadow hover:bg-[#bfa14e] transition">Get Started</button>
        </div>
      </section>

      {/* Cases/News Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h4 className="text-xl font-bold mb-4">We Have Handled Cases From Some Of Our Clients</h4>
          <p className="mb-6 text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.</p>
          <button className="bg-[#101726] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#232b36] transition">See more</button>
        </div>
        <div>
          <Image src="/cases.png" alt="Case" width={400} height={250} className="rounded-lg object-cover mb-4" />
          <div className="font-bold mb-2">The Case of William Accused Corruption of Money at Gony Bank</div>
          <p className="mb-4 text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etia
m eu turpis molestie, dictum est a, mattis tellus.</p>
          <button className="bg-[#101726] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#232b36] transition">See detail</button>
        </div>
      </section>

      {/* Experience/Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <Image src="/mizan.png" alt="Scales" width={400} height={250} className="rounded-lg object-cover" />
        </div>
        <div className="flex-1">
          <h4 className="text-2xl font-bold mb-4">28 Years Has Been A Legal Attorney And Consulting</h4>
          <ul className="space-y-2 text-gray-700">
            <li>✔ Success Handled Cases</li>
            <li>✔ Responsible Raised</li>
            <li>✔ Success Handled Cases</li>
            <li>✔ Responsible Raised</li>
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h4 className="text-2xl font-bold mb-8">Our Happy Client Say About Us</h4>
        <div className="flex flex-col items-center">
          <Image src="/person.png" alt="Client" width={100} height={100} className="rounded-full mb-4" />
          <blockquote className="italic text-lg mb-4">&quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.&quot;</blockquote>
          <div className="font-bold">Jonathan G.</div>
          <div className="text-[#CBB26A] text-xl">★★★★★ 4.5 Reviewed</div>
        </div>
      </section>

      {/* Blog/News */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h4 className="text-2xl font-bold text-center mb-8">The Latest News And Blog From Northman</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((n, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <Image src={n.img} alt={n.title} width={360} height={200} className="rounded-lg object-cover mb-4" />
              <div className="font-bold mb-2">{n.title}</div>
              <p className="text-gray-700 mb-4">{n.desc}</p>
              <button className="bg-[#101726] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#232b36] transition mt-auto">Read more</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101726] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏛️</span>
              <span className="text-xl font-bold">LawConnect</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie pellentesque urna libero velit porta.
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
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Business Law</li>
              <li>Education Law</li>
              <li>Legal Consultant</li>
              <li>General Lawyer</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Pages</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Lawyer</li>
              <li>Appointment</li>
              <li>Documentation</li>
              <li>Cases</li>
              <li>News</li>
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
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          © 2025 LawConnect. All rights reserved.
        </div>
      </footer>
      
    </div>
  );
}
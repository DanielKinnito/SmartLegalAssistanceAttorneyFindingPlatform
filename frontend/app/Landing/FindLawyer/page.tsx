import Image from 'next/image';

const lawyers = [
  {
    name: 'Laitman Harry',
    title: 'Senior Business Lawyer',
    img: '/lait.png',
  },
  {
    name: 'Nada Geomorgant',
    title: 'Senior Business Lawyer',
    img: '/nada.png',
  },
  {
    name: 'Desy Willy',
    title: 'Senior Business Lawyer',
    img: '/desy.png',
  },
  {
    name: 'Hernando Jully',
    title: 'Senior Business Lawyer',
    img: '/lucas.png',
  },
  {
    name: 'Lydia Dary',
    title: 'Senior Business Lawyer',
    img: '/lydia.png',
  },
  {
    name: 'Natasha',
    title: 'Senior Business Lawyer',
    img: '/natasha.png',
  },
];

export default function FindLawyerPage() {
  return (
    <main className="bg-white min-h-screen font-serif">
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
        <div className="relative z-10 flex items-center justify-between px-10 pt-8">
          <div className="flex items-center gap-2 select-none">
            <span className="text-2xl">🏛️</span>
            <span className="text-2xl font-bold text-white ml-2">LawConnect</span>
          </div>
          <nav className="flex gap-8 text-white text-base font-medium">
            <a href="#" className="hover:text-white/80">Home</a>
            <a href="#" className="hover:text-white/80">About</a>
            <a href="#" className="hover:text-white/80">Services</a>
            <a href="#" className="font-bold border-b-2 border-white pb-1">FindLawyer</a>
            <a href="#" className="hover:text-white/80">Contact Us</a>
          </nav>
        </div>
        {/* Title, divider, and description */}
        <div className="relative z-10 flex flex-col md:flex-row items-center max-w-5xl mx-auto px-8 mt-8 h-full">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-0 leading-tight">FindLawer</h1>
          </div>
          <div className="h-32 w-px bg-white mx-8 hidden md:block" />
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie pellentesque urna libero velit porta. Velit pellentesque hac gravida pellentesque est semper. Duis lectus gravida
            </p>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-16">
          <h2 className="text-4xl font-bold mb-8 md:mb-0 md:text-left w-full md:w-1/2 leading-tight">
            Professional Services<br />Prepared To Be Your<br />Lawyer Firm
          </h2>
          <p className="text-gray-700 text-base md:text-lg max-w-md md:text-right w-full md:w-1/2">
            Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie pellentesque urna libero velit porta. Velit pellentesque hac gravida pellentesque est semper. Duis lectus gravida pellentesque est
          </p>
        </div>
        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16">
          {lawyers.map((lawyer, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-[260px] h-[260px] rounded-md overflow-hidden mb-6 bg-gray-100 flex items-center justify-center">
                <Image src={lawyer.img} alt={lawyer.name} width={260} height={260} className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-1">{lawyer.name}</h3>
              <p className="text-gray-600 text-sm">{lawyer.title}</p>
            </div>
          ))}
        </div>
      </section>
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
  )
}

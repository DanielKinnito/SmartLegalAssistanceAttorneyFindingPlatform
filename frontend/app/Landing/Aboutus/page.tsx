import Image from 'next/image';

const ColumnIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="6" width="18" height="3" rx="1.5" fill="#fff"/>
    <rect x="10" y="9" width="12" height="16" rx="2" fill="#fff"/>
    <rect x="7" y="25" width="18" height="3" rx="1.5" fill="#fff"/>
  </svg>
);

export default function About() {
  return (
    <div className="bg-white min-h-screen font-serif">
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
        <nav className="relative z-10 max-w-7xl mx-auto px-8 pt-8 flex justify-between items-center">
          <div className="flex items-center gap-2 select-none">
            <ColumnIcon />
            <span className="text-2xl font-bold text-white ml-2">LawConnect</span>
          </div>
          <div className="flex items-center space-x-8 text-base font-medium">
            <a href="#" className="text-white/80 hover:text-white transition">Home</a>
            <a href="#" className="text-white font-bold border-b-2 border-white pb-1">About</a>
            <a href="#" className="text-white/80 hover:text-white transition">Services</a>
            <a href="#" className="text-white/80 hover:text-white transition">FindLawyer</a>
            <a href="#" className="text-white/80 hover:text-white transition">Contact Us</a>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-row items-center h-full max-w-5xl mx-auto px-8 mt-8">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-0 leading-tight">About Us</h1>
          </div>
          <div className="h-32 w-px bg-white/30 mx-8 hidden md:block" />
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-white text-base md:text-lg leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie pellentesque urna libero velit porta. Velit pellentesque hac gravida pellentesque est semper. Duis lectus gravida
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
              Helping To<br />Overcome And<br />Ease The Legal<br />Burden
            </h2>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-[320px] h-[320px] bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
              <Image src="/silver_law.png" alt="Lady Justice" width={320} height={320} className="object-cover" />
            </div>
          </div>
        </section>
        <div className="text-center text-gray-700 text-sm max-w-3xl mx-auto mb-12">
          Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie pellentesque urna libero velit porta. Velit pellentesque hac gravida pellentesque est semper. Duis lectus gravida ultricies eleifend in pharetra faucibus orci sem. Proin ac a cursus praesent. Malesuada risus amet nunc posuere rhoncus accumsan congue id dolor. Convallis maecenas sed in pellentesque. Diam tristique semper mauris dolor amet. Dolor elit nunc et purus quam amet laoreet eu risus.Cum mattis mollis odio gravida adipiscing. Facilisis scelerisque non lacinia tincidunt faucibus tortor ut erat risus etiam quam pretium ornare. Semper orci arcu pulvinar adipiscing pretium. Est facilisis dis arcu senectus sit mi fermentum eu aliquam. Felis neque posuere
          <br /><br />
          Augue tristique quis fringilla nisi quam nisi. Erat pellentesque elementum consequat quis volutpat diam praesent molestie. Molestie scelerisque eleifend eu amet quam vitae fusce aliquam ornare. Accumsan est ut et tristique arcu. Semper lectus vulputate volutpat consectetur gravida ac gravida. Sem placerat pellentesque turpis tellus etiam porttitor sed. Scelerisque condimentum volutpat tempus lobortis. Accumsan dui felis turpis elementum. Leo nibh magnis sodales diam purus dui. Amet nulla urna curabitur consequat augue faucibus rutrum. Est egestas arcu rutrum mauris facilisis elementum diam bibendum tortor id. Magna facilisis egestas sapien faucibus consectetur arcu faucibus. Mattis sapien felis id rutrum mattis nunc.
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
            <h3 className="text-3xl font-bold mb-4 leading-tight">Hello People,<br />Welcome To<br />LawConnect</h3>
            <div className="text-gray-700 text-sm">
              Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie pellentesque urna libero velit porta. Velit pellentesque hac gravida pellentesque est semper. Duis lectus gravida ultricies eleifend in pharetra faucibus orci sem. Proin ac a cursus praesent. Malesuada risus amet nunc posuere rhoncus accumsan congue id dolor. Convallis maecenas sed in pellentesque. Diam tristique semper mauris dolor amet. Dolor elit nunc et purus quam amet laoreet eu risus.Cum mattis mollis odio gravida adipiscing. Facilisis scelerisque non lacinia tincidunt faucibus tortor ut erat risus etiam quam pretium ornare. Semper orci arcu pulvinar adipiscing pretium. Est facilisis dis arcu senectus sit mi fermentum eu aliquam. Felis neque posuere
              <br /><br />
              Augue tristique quis fringilla nisi quam nisi. Erat pellentesque elementum consequat quis volutpat diam praesent molestie. Molestie scelerisque eleifend eu amet quam vitae fusce aliquam ornare. Accumsan est ut et tristique arcu. Semper lectus vulputate volutpat consectetur gravida ac gravida. Sem placerat pellentesque turpis tellus etiam porttitor sed. Scelerisque condimentum volutpat tempus lobortis. Accumsan dui felis turpis elementum. Leo nibh magnis sodales diam purus dui. Amet nulla urna curabitur consequat augue faucibus rutrum. Est egestas arcu rutrum mauris facilisis elementum diam bibendum tortor id. Magna facilisis egestas sapien faucibus consectetur arcu faucibus. Mattis sapien felis id rutrum mattis nunc.
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="flex flex-col md:flex-row gap-12 justify-between mt-12 border-t border-gray-200 pt-12">
          <div className="md:w-1/2 pr-8 border-r border-gray-200">
            <h4 className="text-3xl font-bold mb-4">Our Vision</h4>
            <div className="text-gray-700 text-sm">
              Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie pellentesque urna libero velit porta. Velit pellentesque hac gravida pellentesque est semper. Duis lectus gravida ultricies eleifend in pharetra faucibus orci sem. Proin ac a cursus praesent.
              <br /><br />
              Augue tristique quis fringilla nisi quam nisi. Erat pellentesque elementum consequat quis volutpat diam praesent molestie. Molestie scelerisque eleifend eu amet quam vitae fusce aliquam ornare. Accumsan est ut et tristique arcu. Semper lectus vulputate volutpat
            </div>
          </div>
          <div className="md:w-1/2 pl-8">
            <h4 className="text-3xl font-bold mb-4">Our Mission</h4>
            <div className="text-gray-700 text-sm">
              Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molestie pellentesque urna libero velit porta. Velit pellentesque hac gravida pellentesque est semper. Duis lectus gravida ultricies eleifend in pharetra faucibus orci sem. Proin ac a cursus praesent.
              <br /><br />
              Augue tristique quis fringilla nisi quam nisi. Erat pellentesque elementum consequat quis volutpat diam praesent molestie. Molestie scelerisque eleifend eu amet quam vitae fusce aliquam ornare. Accumsan est ut et tristique arcu. Semper lectus vulputate volutpat
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
              <h4 className="text-lg font-semibold mb-4">Services</h4>
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
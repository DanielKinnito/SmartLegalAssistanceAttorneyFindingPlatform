import Image from "next/image"
import Link from "next/link"
import { Star, CheckCircle, Clock, MapPin, Building, FileText, GraduationCap, Award } from "lucide-react"

export default function AttorneyProfile({ params }: { params: { id: string } }) {
  

  return (
    <div className="min-h-screen bg-[#fafafa]">

     
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Attorney Profile</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-[#dddddd] rounded-md flex items-center justify-center mb-4">
                  <span className="text-2xl text-[#a3a3a3]">...</span>
                </div>
                <h2 className="text-xl font-bold">John Doe, Esq.</h2>
                <p className="text-[#71717a] text-sm">Corporate Law Specialist</p>
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#eab308] text-[#eab308]" />
                  ))}
                  <Star className="w-4 h-4 text-[#eab308] fill-transparent" />
                  <span className="ml-1 text-sm">(4.2)</span>
                </div>
                <div className="mt-2">
                  <span className="bg-[#4ade80]/20 text-[#4ade80] text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Availability</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Available for new clients</span>
                  <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out">
                    <input type="checkbox" id="new-clients" defaultChecked className="opacity-0 w-0 h-0" />
                    <label
                      htmlFor="new-clients"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white transform translate-x-4 transition-transform duration-200 ease-in-out"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Working Hours</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">Monday - Friday</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">Saturday</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Bono Work Card */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Pro Bono Work</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Available for Pro Bono</span>
                  <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out">
                    <input type="checkbox" id="pro-bono" defaultChecked className="opacity-0 w-0 h-0" />
                    <label
                      htmlFor="pro-bono"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white transform translate-x-4 transition-transform duration-200 ease-in-out"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Pro Bono Hours</h4>
                <div className="flex items-center">
                  <span className="text-sm text-[#71717a]">This Year</span>
                  <span className="ml-2 bg-[#1e2e45] text-white text-xs px-2 py-1 rounded-full">45 hours</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Areas of Interest</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#f8fafc] text-xs px-3 py-1 rounded-full">Immigration</span>
                  <span className="bg-[#f8fafc] text-xs px-3 py-1 rounded-full">Family Law</span>
                  <span className="bg-[#f8fafc] text-xs px-3 py-1 rounded-full">Housing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-3/4">
            {/* Tabs */}
            <div className="flex border-b border-[#e4e4e7] mb-6">
              <button className="px-6 py-3 border-b-2 border-[#1e2e45] font-medium">Profile</button>
              <button className="px-6 py-3 text-[#71717a]">Cases</button>
              <button className="px-6 py-3 text-[#71717a]">Reviews</button>
            </div>

            {/* Personal Information */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                    <span className="text-[#71717a] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    <span>John Doe</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                    <span className="text-[#71717a] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </span>
                    <span>john.doe@legalfirm.com</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                    <span className="text-[#71717a] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                    <span>(555) 123-4567</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                    <span className="text-[#71717a] mr-2">
                      <MapPin size={20} />
                    </span>
                    <span>New York, NY</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Biography</label>
                <div className="border border-[#e4e4e7] rounded-md p-3">
                  <p className="text-sm">
                    Corporate attorney with over 15 years of experience specializing in mergers and acquisitions,
                    securities law, and corporate governance. Graduated from Harvard Law School and previously worked at
                    top law firms in New York.
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Professional Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Practice Areas</label>
                  <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                    <span className="text-[#71717a] mr-2">
                      <Building size={20} />
                    </span>
                    <span>Corporate Law, M&A, Securities</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bar Number</label>
                  <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                    <span className="text-[#71717a] mr-2">
                      <FileText size={20} />
                    </span>
                    <span>NY123456</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Years in Practice</label>
                  <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                    <span className="text-[#71717a] mr-2">
                      <Clock size={20} />
                    </span>
                    <span>15</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Law Firm</label>
                  <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                    <span className="text-[#71717a] mr-2">
                      <Building size={20} />
                    </span>
                    <span>Smith & Associates</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Education</label>
                <div className="border border-[#e4e4e7] rounded-md p-3">
                  <div className="flex items-start">
                    <span className="text-[#71717a] mr-2 mt-1">
                      <GraduationCap size={20} />
                    </span>
                    <span>
                      J.D., Harvard Law School, 2008
                      <br />
                      B.A., Political Science, Yale University, 2005
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Certifications & Awards</label>
                <div className="border border-[#e4e4e7] rounded-md p-3">
                  <div className="flex items-start">
                    <span className="text-[#71717a] mr-2 mt-1">
                      <Award size={20} />
                    </span>
                    <span>
                      Board Certified in Corporate Law
                      <br />
                      Super Lawyers Rising Star, 2015-2020
                      <br />
                      New York Bar Association Excellence Award, 2018
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Reviews</h2>

              {/* Sample Reviews */}
              <div className="space-y-6">
                <div className="border-b border-[#e4e4e7] pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Sarah Johnson</h4>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= 5 ? "fill-[#eab308] text-[#eab308]" : "text-[#eab308] fill-transparent"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-[#71717a]">June 12, 2023</span>
                  </div>
                  <p className="text-sm mt-2">
                    John was extremely professional and knowledgeable. He helped me navigate a complex corporate merger
                    with ease. Highly recommended!
                  </p>
                </div>

                <div className="border-b border-[#e4e4e7] pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Michael Chen</h4>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= 4 ? "fill-[#eab308] text-[#eab308]" : "text-[#eab308] fill-transparent"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-[#71717a]">May 3, 2023</span>
                  </div>
                  <p className="text-sm mt-2">
                    Great experience working with John on our company's securities compliance issues. He's thorough and
                    explains complex legal matters in an understandable way.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Emily Rodriguez</h4>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= 4 ? "fill-[#eab308] text-[#eab308]" : "text-[#eab308] fill-transparent"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-[#71717a]">April 18, 2023</span>
                  </div>
                  <p className="text-sm mt-2">
                    John provided excellent counsel during our startup's funding round. His expertise in securities law
                    was invaluable. Would definitely work with him again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

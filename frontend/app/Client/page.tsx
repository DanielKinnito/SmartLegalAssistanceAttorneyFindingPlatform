import NavbarClient from "@/components/navbar"
import { Navbar } from "@/components/navbar copy"
import { Search, MapPin, Clock, Star, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function FindAttorney() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Find an Attorney</h1>

        {/* Search Bar */}
        <div className="flex mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search Attorney"
              className="w-full border border-[#e4e4e7] rounded-l-lg py-3 px-10 focus:outline-none"
            />
            <Search className="absolute left-3 top-3.5 text-[#a3a3a3] w-5 h-5" />
          </div>
          <button className="bg-[#1e2e45] text-white px-6 py-3 rounded-r-lg font-medium">Search</button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#e4e4e7] rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Practice Areas */}
            <div>
              <h3 className="font-medium mb-3">Practice Areas</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Constitutional</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2 h-4 w-4" />
                  <span>Civil</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Criminal</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Commercial</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Labor</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Family</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Land</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Investment</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Human Rights</span>
                </label>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-medium mb-3">Location</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2 h-4 w-4" />
                  <span>Addis Ababa</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Adama</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Dire Dawa</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Hawassa</span>
                </label>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="font-medium mb-3">Experience</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2 h-4 w-4" />
                  <span>0-2 Years</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>2-5 Years</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>5-10 Years</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>10+ Years</span>
                </label>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-medium mb-3">Rating</h3>
              <div className="px-2">
                <div className="flex justify-between mb-2">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="3"
                  className="w-full h-1 bg-[#e4e4e7] rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-4">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 h-4 w-4" />
                    <span>Gives Pro bono Service</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-end mt-6 space-x-3">
            <button className="px-4 py-2 border border-[#e4e4e7] rounded text-sm">Reset Filters</button>
            <button className="px-4 py-2 bg-[#1e2e45] text-white rounded text-sm">Apply Filters</button>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-[#71717a]">Showing 15 attorneys</p>
          <div className="flex items-center">
            <span className="text-sm mr-2">Sort by:</span>
            <select className="border border-[#e4e4e7] rounded py-1 px-3 bg-[#f8fafc] text-sm">
              <option>Relevance</option>
              <option>Rating</option>
              <option>Experience</option>
            </select>
          </div>
        </div>

        {/* Attorney Cards */}
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-white border border-[#e4e4e7] rounded-lg p-6 mb-4 flex">
            <div className="mr-6">
              <div className="w-32 h-32 bg-[#dddddd] rounded-md flex items-center justify-center">
                <span className="text-2xl text-[#a3a3a3]">...</span>
              </div>
              <h3 className="font-bold text-center mt-2">John Doe</h3>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#eab308] text-[#eab308]" />
                ))}
                <Star className="w-4 h-4 text-[#eab308]" />
                <span className="ml-1 text-sm">4.0</span>
              </div>
              <div className="flex justify-center mt-1">
                <span className="bg-[#4ade80]/20 text-[#4ade80] text-xs px-2 py-1 rounded-full flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" /> Approved
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex mb-3 space-x-3">
                <span className="bg-[#f8fafc] text-xs px-3 py-1 rounded-full">Family Law</span>
                <span className="bg-[#f8fafc] text-xs px-3 py-1 rounded-full">Real Estate</span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-[#71717a]" />
                  <span>Addis Ababa, AA</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-[#71717a]" />
                  <span>8 years experience</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-[#71717a]" />
                  <span>Limited availability</span>
                </div>
              </div>

              <p className="text-sm text-[#71717a] mb-4">
                Corporate attorney specializing in mergers and acquisitions, securities law, and corporate governance.
                Previously worked at top law firms in New York.
              </p>

              <div className="flex space-x-3">
                <Link href={`/attorney/${index}`} className="bg-[#18181b] text-white px-6 py-2 rounded text-sm">
                  View Profile
                </Link>
                <button className="border border-[#e4e4e7] px-6 py-2 rounded text-sm">Request Consultation</button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

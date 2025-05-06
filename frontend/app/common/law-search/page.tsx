import Image from "next/image"
import Link from "next/link"
import { Bookmark, ChevronDown, ChevronLeft, ChevronRight, Download, Search, Share } from "lucide-react"
import Header from "@/components/Header"

export default function LawSearch() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
     <Header/>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Law and Regulation Search</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-full md:w-1/4">
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              {/* Jurisdiction */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Jurisdiction</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 h-4 w-4" />
                    <span>Federal</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 h-4 w-4" />
                    <span>State</span>
                  </label>
                </div>
              </div>

              {/* Legal Category */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Legal Category</h3>
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

              {/* Filter Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-[#18181b] text-white py-2 rounded text-sm">Apply Filters</button>
                <button className="w-full text-center text-sm text-[#71717a]">Reset</button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-3/4">
            {/* Search Bar */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg p-6 mb-6">
              <div className="flex mb-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search laws and regulations"
                    className="w-full border border-[#e4e4e7] rounded-lg py-3 px-10 focus:outline-none"
                  />
                  <Search className="absolute left-3 top-3.5 text-[#a3a3a3] w-5 h-5" />
                </div>
                <button className="bg-[#1e2e45] text-white px-6 py-3 rounded-lg font-medium ml-3">Search</button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#f8fafc] border border-[#e4e4e7] text-sm px-3 py-1 rounded-full">Federal</span>
                <span className="bg-[#f8fafc] border border-[#e4e4e7] text-sm px-3 py-1 rounded-full">Civil</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg mb-6">
              <div className="flex border-b border-[#e4e4e7]">
                <button className="px-6 py-3 border-b-2 border-[#1e2e45] font-medium">Search Results</button>
                <button className="px-6 py-3 text-[#71717a]">Recent Searches</button>
                <button className="px-6 py-3 text-[#71717a]">Bookmarked</button>
              </div>

              {/* Results Count and Sort */}
              <div className="p-4 flex justify-between items-center">
                <p className="text-sm text-[#71717a]">Showing 1-5 of 128 results</p>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Sort by:</span>
                  <select className="border border-[#e4e4e7] rounded py-1 px-3 bg-[#f8fafc] text-sm">
                    <option>Relevance</option>
                    <option>Date</option>
                    <option>Title</option>
                  </select>
                </div>
              </div>

              {/* Results List */}
              <div className="divide-y divide-[#e4e4e7]">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="p-6">
                    <div className="flex gap-2 mb-2">
                      <span className="bg-[#f8fafc] text-xs px-2 py-1 rounded-full">Regulation</span>
                      <span className="bg-[#f8fafc] text-xs px-2 py-1 rounded-full">Securities</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">The Ethiopian Civil Code (1960)</h3>
                    <p className="text-sm text-[#71717a] mb-3">Proclamation No. 165/1960</p>
                    <p className="text-sm mb-4">
                      Provides for regulation of securities exchanges and markets, prohibits certain types of conduct in
                      the markets, and provides the SEC with disciplinary powers.
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center text-sm text-[#71717a]">
                        <ChevronDown className="w-4 h-4 mr-1" /> Show More
                      </button>
                      <button className="text-[#71717a]">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="text-[#71717a]">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-[#71717a]">
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center p-6">
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e4e4e7]">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1e2e45] text-white">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e4e4e7]">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e4e4e7]">
                    3
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e4e4e7]">
                    4
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e4e4e7]">
                    5
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e4e4e7]">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

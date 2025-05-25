"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bookmark, ChevronDown, ChevronLeft, ChevronRight, Download, Search, Share } from "lucide-react"
import Header from "@/components/Header"
import { adminService } from "@/app/services/admin-api"
import { toast } from "react-hot-toast"

interface Document {
  id: string
  title: string
  description: string
  category: string
  jurisdiction: string
  language: string
  proclamation_number: string
  publication_year: number
  document_url: string
  created_at: string;
}

export default function LawSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    jurisdiction: ["Federal"],
    category: ["Civil"]
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [sortBy, setSortBy] = useState("relevance")

  const handleSearch = async () => {
    try {
      setLoading(true)
      const allDocuments = await adminService.getDocuments()
      
      // Filter documents based on search query
      let filteredDocs = allDocuments.filter(doc => {
        // Search query filter
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch = searchQuery === "" || 
          doc.title.toLowerCase().includes(searchLower) ||
          doc.description.toLowerCase().includes(searchLower) ||
          doc.proclamation_number.toLowerCase().includes(searchLower)

        // Jurisdiction filter
        const matchesJurisdiction = selectedFilters.jurisdiction.length === 0 || 
          selectedFilters.jurisdiction.includes(doc.jurisdiction)

        // Category filter
        const matchesCategory = selectedFilters.category.length === 0 || 
          selectedFilters.category.includes(doc.category)

        return matchesSearch && matchesJurisdiction && matchesCategory
      })

      // Sort documents
      filteredDocs = filteredDocs.sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          case "title":
            return a.title.localeCompare(b.title)
          default: // relevance
            return 0
        }
      })

      // Pagination
      const startIndex = (currentPage - 1) * 10
      const endIndex = startIndex + 10
      const paginatedDocs = filteredDocs.slice(startIndex, endIndex)

      setDocuments(paginatedDocs)
      setTotalResults(filteredDocs.length)
    } catch (error) {
      toast.error("Failed to fetch legal documents")
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (type: "jurisdiction" | "category", value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[type]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [type]: newValues
      }
    })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    handleSearch()
  }, [currentPage, sortBy, selectedFilters])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

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
                  {["Federal", "State"].map((jurisdiction) => (
                    <label key={jurisdiction} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.jurisdiction.includes(jurisdiction)}
                        onChange={() => handleFilterChange("jurisdiction", jurisdiction)}
                        className="mr-2 h-4 w-4"
                      />
                      <span>{jurisdiction}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Legal Category */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Legal Category</h3>
                <div className="space-y-2">
                  {[
                    "Constitutional", "Civil", "Criminal", "Commercial",
                    "Labor", "Family", "Land", "Investment", "Human Rights"
                  ].map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.category.includes(category)}
                        onChange={() => handleFilterChange("category", category)}
                        className="mr-2 h-4 w-4"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleSearch}
                  className="w-full bg-[#18181b] text-white py-2 rounded text-sm hover:bg-[#18181b]/90 transition-colors"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={() => {
                    setSelectedFilters({
                      jurisdiction: [],
                      category: []
                    })
                  }}
                  className="w-full text-center text-sm text-[#71717a] hover:text-[#71717a]/80 transition-colors"
                >
                  Reset
                </button>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search laws and regulations"
                    className="w-full border border-[#e4e4e7] rounded-lg py-3 px-10 focus:outline-none focus:border-[#1e2e45]"
                  />
                  <Search className="absolute left-3 top-3.5 text-[#a3a3a3] w-5 h-5" />
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-[#1e2e45] text-white px-6 py-3 rounded-lg font-medium ml-3 hover:bg-[#1e2e45]/90 transition-colors"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {selectedFilters.jurisdiction.map(filter => (
                  <span key={filter} className="bg-[#f8fafc] border border-[#e4e4e7] text-sm px-3 py-1 rounded-full">
                    {filter}
                  </span>
                ))}
                {selectedFilters.category.map(filter => (
                  <span key={filter} className="bg-[#f8fafc] border border-[#e4e4e7] text-sm px-3 py-1 rounded-full">
                    {filter}
                  </span>
                ))}
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white border border-[#e4e4e7] rounded-lg mb-6">
              {/* Results Count and Sort */}
              <div className="p-4 flex justify-between items-center">
                <p className="text-sm text-[#71717a]">
                  Showing {documents.length} of {totalResults} results
                </p>
                <div className="flex items-center">
                  <span className="text-sm mr-2">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={handleSortChange}
                    className="border border-[#e4e4e7] rounded py-1 px-3 bg-[#f8fafc] text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>

              {/* Results List */}
              <div className="divide-y divide-[#e4e4e7]">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-6">
                    <div className="flex gap-2 mb-2">
                      <span className="bg-[#f8fafc] text-xs px-2 py-1 rounded-full">{doc.jurisdiction}</span>
                      <span className="bg-[#f8fafc] text-xs px-2 py-1 rounded-full">{doc.category}</span>
                      <span className="bg-[#f8fafc] text-xs px-2 py-1 rounded-full">{doc.language}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{doc.title}</h3>
                    <p className="text-sm text-[#71717a] mb-3">
                      Proclamation No. {doc.proclamation_number} ({doc.publication_year})
                    </p>
                    <p className="text-sm mb-4">{doc.description}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center text-sm text-[#71717a] hover:text-[#71717a]/80 transition-colors">
                        <ChevronDown className="w-4 h-4 mr-1" /> Show More
                      </button>
                      <button className="text-[#71717a] hover:text-[#71717a]/80 transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <a 
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#71717a] hover:text-[#71717a]/80 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button className="text-[#71717a] hover:text-[#71717a]/80 transition-colors">
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center p-6">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e4e4e7] disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === page
                          ? "bg-[#1e2e45] text-white"
                          : "border border-[#e4e4e7]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === 5}
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e4e4e7] disabled:opacity-50"
                  >
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

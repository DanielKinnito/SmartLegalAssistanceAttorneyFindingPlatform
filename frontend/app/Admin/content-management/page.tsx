"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { adminService, Document, CreateDocumentData } from "@/app/services/admin-api"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, FileText, Search } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const CATEGORIES = [
  { value: 'CONSTITUTIONAL', label: 'Constitutional' },
  { value: 'CIVIL', label: 'Civil' },
  { value: 'CRIMINAL', label: 'Criminal' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LABOR', label: 'Labor' },
  { value: 'FAMILY', label: 'Family' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'HUMAN_RIGHTS', label: 'Human Rights' }
];

const JURISDICTIONS = [
  { value: 'FEDERAL', label: 'Federal Government' },
  { value: 'ADDIS_ABABA', label: 'Addis Ababa Municipality' },
  { value: 'OROMIA', label: 'Oromia Regional State' },
  { value: 'TIGRAY', label: 'Tigray Regional State' },
  { value: 'AMHARA', label: 'Amhara Regional State' },
  { value: 'SNNPR', label: 'Southern Nations, Nationalities, and Peoples\' Regional State (SNNPR)' },
  { value: 'SIDAMA', label: 'Sidama Regional State' },
  { value: 'AFAR', label: 'Afar Regional State' },
  { value: 'SOMALI', label: 'Somali Regional State' },
  { value: 'BENISHANGUL_GUMUZ', label: 'Benishangul-Gumuz Regional State' },
  { value: 'GAMBELA', label: 'Gambela Regional State' },
  { value: 'HARARI', label: 'Harari Regional State' },
  { value: 'DIRE_DAWA', label: 'Dire Dawa City Administration' }
];

// Add this custom styling for Select components
const selectStyles = {
  trigger: "w-full bg-[#29374A] text-white border-none hover:bg-[#1f2a3a] focus:ring-2 focus:ring-[#29374A]",
  content: "bg-white border border-gray-200 rounded-lg shadow-lg",
  item: "text-gray-700 hover:bg-gray-100 cursor-pointer",
  value: "text-white"
};

export default function ContentManagement() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getDocuments()
      setDocuments(data)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue")
          router.push('/Admin/login')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error("Failed to fetch documents")
      }
      console.error("Error fetching documents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDocument = async (formData: FormData) => {
    try {
      const file = formData.get('document') as File
      console.log('File being uploaded:', file) // Debug log

      if (!file || file.size === 0) {
        toast.error("Please select a document to upload")
        return
      }

      // Create a new FormData instance
      const submitData = new FormData()
      
      // Add all form fields
      submitData.append('title', formData.get('title') as string)
      submitData.append('description', formData.get('description') as string)
      submitData.append('category', formData.get('category') as string)
      submitData.append('jurisdiction', formData.get('jurisdiction') as string)
      submitData.append('language', formData.get('language') as string)
      submitData.append('proclamation_number', formData.get('proclamation_number') as string)
      submitData.append('publication_year', formData.get('publication_year') as string)
      
      // Append the file with the correct field name expected by the backend
      submitData.append('document', file)

      // Debug log to check FormData contents
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }

      const response = await adminService.createDocument(submitData)
      console.log('Upload response:', response) // Debug log

      await fetchDocuments()
      setIsCreateDialogOpen(false)
      toast.success("Document created successfully")
    } catch (error) {
      console.error('Full error object:', error) // Debug log
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue")
          router.push('/Admin/login')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error("Failed to create document")
      }
    }
  }

  const handleUpdateDocument = async (id: string, formData: FormData) => {
    try {
      const file = formData.get('document') as File
      console.log('File being uploaded:', file) // Debug log
      
      // Create a new FormData instance
      const submitData = new FormData()
      
      // Add all form fields
      submitData.append('title', formData.get('title') as string)
      submitData.append('description', formData.get('description') as string)
      submitData.append('category', formData.get('category') as string)
      submitData.append('jurisdiction', formData.get('jurisdiction') as string)
      submitData.append('language', formData.get('language') as string)
      submitData.append('proclamation_number', formData.get('proclamation_number') as string)
      submitData.append('publication_year', formData.get('publication_year') as string)
      
      // Only append file if a new one was selected
      if (file && file.size > 0) {
        submitData.append('document', file)
      }

      // Debug log to check FormData contents
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }

      const response = await adminService.updateDocument(id, submitData)
      console.log('Update response:', response) // Debug log

      await fetchDocuments()
      setIsEditDialogOpen(false)
      setSelectedDocument(null)
      toast.success("Document updated successfully")
    } catch (error) {
      console.error('Full error object:', error) // Debug log
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue")
          router.push('/Admin/login')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error("Failed to update document")
      }
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      await adminService.deleteDocument(id)
      await fetchDocuments()
      toast.success("Document deleted successfully")
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue")
          router.push('/Admin/login')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error("Failed to delete document")
      }
      console.error("Error deleting document:", error)
    }
  }

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => {
    const searchLower = searchQuery.toLowerCase()
    return searchQuery === "" || 
      doc.title.toLowerCase().includes(searchLower) ||
      doc.description.toLowerCase().includes(searchLower) ||
      doc.category.toLowerCase().includes(searchLower) ||
      doc.jurisdiction.toLowerCase().includes(searchLower) ||
      doc.proclamation_number.toLowerCase().includes(searchLower)
  })

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 bg-[#29374A] text-white px-4 py-2 rounded-lg hover:bg-[#1f2a3a] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Document
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select
              value={selectedJurisdiction}
              onValueChange={setSelectedJurisdiction}
            >
              <SelectTrigger className={selectStyles.trigger}>
                <SelectValue placeholder="Select Jurisdiction" className={selectStyles.value} />
              </SelectTrigger>
              <SelectContent className={selectStyles.content}>
                <SelectItem value="all" className={selectStyles.item}>All Jurisdictions</SelectItem>
                {JURISDICTIONS.map((jurisdiction) => (
                  <SelectItem key={jurisdiction.value} value={jurisdiction.value} className={selectStyles.item}>
                    {jurisdiction.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500">Get started by adding a new document</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{doc.title}</h3>
                      <p className="text-gray-600 mb-4">{doc.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {doc.category}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {doc.jurisdiction}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {doc.language}
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          {doc.proclamation_number}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {doc.publication_year}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDocument(doc)
                          setIsEditDialogOpen(true)
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                      Created: {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                    <a
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Document Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Add New Document</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleCreateDocument(formData)
            }}>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Select name="category" required>
                      <SelectTrigger className={selectStyles.trigger}>
                        <SelectValue placeholder="Select category" className={selectStyles.value} />
                      </SelectTrigger>
                      <SelectContent className={selectStyles.content}>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value} className={selectStyles.item}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
                    <Select name="jurisdiction" required>
                      <SelectTrigger className={selectStyles.trigger}>
                        <SelectValue placeholder="Select jurisdiction" className={selectStyles.value} />
                      </SelectTrigger>
                      <SelectContent className={selectStyles.content}>
                        {JURISDICTIONS.map((jurisdiction) => (
                          <SelectItem key={jurisdiction.value} value={jurisdiction.value} className={selectStyles.item}>
                            {jurisdiction.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <input
                      type="text"
                      name="language"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proclamation Number</label>
                    <input
                      type="text"
                      name="proclamation_number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publication Year</label>
                    <input
                      type="number"
                      name="publication_year"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document File</label>
                    <input
                      type="file"
                      name="document"
                      required
                      accept=".pdf,.doc,.docx"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#29374A] text-white rounded-lg hover:bg-[#1f2a3a]"
                >
                  Create Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Document Dialog */}
      {isEditDialogOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Edit Document</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleUpdateDocument(selectedDocument.id, formData)
            }}>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedDocument.title}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={selectedDocument.description}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Select name="category" defaultValue={selectedDocument.category} required>
                      <SelectTrigger className={selectStyles.trigger}>
                        <SelectValue placeholder="Select category" className={selectStyles.value} />
                      </SelectTrigger>
                      <SelectContent className={selectStyles.content}>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value} className={selectStyles.item}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
                    <Select name="jurisdiction" defaultValue={selectedDocument.jurisdiction} required>
                      <SelectTrigger className={selectStyles.trigger}>
                        <SelectValue placeholder="Select jurisdiction" className={selectStyles.value} />
                      </SelectTrigger>
                      <SelectContent className={selectStyles.content}>
                        {JURISDICTIONS.map((jurisdiction) => (
                          <SelectItem key={jurisdiction.value} value={jurisdiction.value} className={selectStyles.item}>
                            {jurisdiction.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <input
                      type="text"
                      name="language"
                      defaultValue={selectedDocument.language}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proclamation Number</label>
                    <input
                      type="text"
                      name="proclamation_number"
                      defaultValue={selectedDocument.proclamation_number}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publication Year</label>
                    <input
                      type="number"
                      name="publication_year"
                      defaultValue={selectedDocument.publication_year}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document File</label>
                    <input
                      type="file"
                      name="document"
                      accept=".pdf,.doc,.docx"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                    {selectedDocument.document_url && (
                      <p className="text-sm text-blue-600 mt-1">
                        Current file: <a href={selectedDocument.document_url} target="_blank" rel="noopener noreferrer">View current document</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setSelectedDocument(null)
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#29374A] text-white rounded-lg hover:bg-[#1f2a3a]"
                >
                  Update Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 
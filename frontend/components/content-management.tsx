"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, FileEdit, Plus, Search, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const legalResources = [
  {
    id: 1,
    title: "Guide to Ethiopian Family Law",
    category: "Family Law",
    type: "Guide",
    status: "Published",
    views: 1245,
    author: "Legal Team",
    date: "10/15/2023",
  },
  {
    id: 2,
    title: "Property Rights in Ethiopia",
    category: "Property Law",
    type: "Guide",
    status: "Published",
    views: 1245,
    author: "Legal Team",
    date: "10/15/2023",
  },
  {
    id: 3,
    title: "Guide to Ethiopian Family Law",
    category: "Family Law",
    type: "Guide",
    status: "Draft",
    views: 1245,
    author: "Legal Team",
    date: "10/15/2023",
  },
  {
    id: 4,
    title: "Guide to Ethiopian Family Law",
    category: "Family Law",
    type: "Guide",
    status: "Published",
    views: 1245,
    author: "Legal Team",
    date: "10/15/2023",
  },
  {
    id: 5,
    title: "Guide to Ethiopian Family Law",
    category: "Family Law",
    type: "Guide",
    status: "Published",
    views: 1245,
    author: "Legal Team",
    date: "10/15/2023",
  },
]

const faqs = [
  {
    id: 1,
    question: "What are the requirements for divorce in Ethiopia?",
    category: "Family Law",
    status: "Published",
    views: 2340,
    author: "Legal Team",
    date: "09/22/2023",
  },
  {
    id: 2,
    question: "How do I register property in Ethiopia?",
    category: "Property Law",
    status: "Published",
    views: 1876,
    author: "Legal Team",
    date: "09/15/2023",
  },
  {
    id: 3,
    question: "What are the legal rights of tenants in Ethiopia?",
    category: "Property Law",
    status: "Draft",
    views: 1245,
    author: "Legal Team",
    date: "10/05/2023",
  },
]

const pendingReviews = [
  {
    id: 1,
    title: "Criminal Procedure in Ethiopia",
    category: "Criminal Law",
    type: "Guide",
    submittedBy: "John Doe",
    date: "10/18/2023",
  },
  {
    id: 2,
    title: "Business Registration Process",
    category: "Business Law",
    type: "Article",
    submittedBy: "Sarah Johnson",
    date: "10/17/2023",
  },
]

export function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("legal-resources")

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CONTENT MANAGEMENT</h1>
          <p className="text-muted-foreground">Manage legal resources, FAQs, and other content on the platform.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-[#29374A] text-[#29374A] hover:bg-[#29374A] hover:text-white"
        >
          <Eye className="h-3.5 w-3.5" />
          View Site
        </Button>
      </div>

      <Tabs defaultValue="legal-resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="legal-resources" onClick={() => setActiveTab("legal-resources")}>
            Legal Resources
          </TabsTrigger>
          <TabsTrigger value="faqs" onClick={() => setActiveTab("faqs")}>
            FAQs
          </TabsTrigger>
          <TabsTrigger value="pending-review" onClick={() => setActiveTab("pending-review")}>
            Pending Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="legal-resources" className="space-y-4">
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-1">Legal Resources</h2>
            <p className="text-sm text-muted-foreground mb-4">Manage guides, articles, and document templates.</p>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search resources..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
  <Select defaultValue="all-categories">
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="All Categories" />
    </SelectTrigger>
    <SelectContent className="bg-gray-900 text-white border-none">
      <SelectItem
        value="all-categories"
        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      >
        All Categories
      </SelectItem>
      <SelectItem
        value="family-law"
        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      >
        Family Law
      </SelectItem>
      <SelectItem
        value="property-law"
        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      >
        Property Law
      </SelectItem>
      <SelectItem
        value="business-law"
        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      >
        Business Law
      </SelectItem>
      <SelectItem
        value="criminal-law"
        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      >
        Criminal Law
      </SelectItem>
    </SelectContent>
  </Select>

  <Select defaultValue="all-statuses">
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="All Statuses" />
    </SelectTrigger>
    <SelectContent className="bg-gray-900 text-white border-none">
      <SelectItem
        value="all-statuses"
        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      >
        All Statuses
      </SelectItem>
      <SelectItem
        value="published"
        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      >
        Published
      </SelectItem>
      <SelectItem
        value="draft"
        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      >
        Draft
      </SelectItem>
      <SelectItem
        value="archived"
        className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      >
        Archived
      </SelectItem>
    </SelectContent>
  </Select>
</div>

            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {legalResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">
                            By {resource.author} • {resource.date}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{resource.category}</TableCell>
                      <TableCell>{resource.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            resource.status === "Published"
                              ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                          }
                        >
                          {resource.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{resource.views}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-1">FAQs</h2>
            <p className="text-sm text-muted-foreground mb-4">Manage frequently asked questions and answers.</p>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Select defaultValue="all-categories">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    <SelectItem value="family-law">Family Law</SelectItem>
                    <SelectItem value="property-law">Property Law</SelectItem>
                    <SelectItem value="business-law">Business Law</SelectItem>
                    <SelectItem value="criminal-law">Criminal Law</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-[#29374A] hover:bg-[#29374A]/90 gap-1">
                  <Plus className="h-4 w-4" />
                  Add FAQ
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{faq.question}</p>
                          <p className="text-xs text-muted-foreground">
                            By {faq.author} • {faq.date}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{faq.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            faq.status === "Published"
                              ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                          }
                        >
                          {faq.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{faq.views}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending-review" className="space-y-4">
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-1">Pending Review</h2>
            <p className="text-sm text-muted-foreground mb-4">Review and approve submitted content.</p>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReviews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.title}</p>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.submittedBy}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button size="sm" className="bg-[#29374A] hover:bg-[#29374A]/90 h-8">
                            Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

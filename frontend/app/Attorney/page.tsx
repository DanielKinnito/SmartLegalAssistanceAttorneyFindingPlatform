// import { button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { button } from "@/components/ui/badge"
// import { switch } from "@/components/ui/switch"
// import { label } from "@/components/ui/label"
// import { input } from "@/components/ui/input"
// import { textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, MapPin, Briefcase, Award, Clock, FileText, Calendar, Star } from "lucide-react"

export default function AttorneyProfilePage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Attorney Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-slate-200 mb-4 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=128&width=128"
                    alt="Attorney profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">John Doe, Esq.</h2>
                <p className="text-muted-foreground">Corporate Law Specialist</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-slate-300" />
                  <span className="ml-2 text-sm">(4.2)</span>
                </div>
                <button className="mt-4 w-full">Edit Profile</button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <label htmlFor="available">Available for new clients</label>
                  </div>
                  <switch id="available" />
                </div>

                <div>
                  <label className="mb-2 block">Working Hours</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monday - Friday</span>
                      <span className="text-sm">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Saturday</span>
                      <span className="text-sm">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sunday</span>
                      <span className="text-sm">Closed</span>
                    </div>
                  </div>
                </div>
                <button 
                    className='px-7 py-1 rounded-4xl text-blue-950 bg-white hover:bg-gray-100 transition-colors'
                    type='button'
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                    Edit Schedule
                    </button>
                
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro Bono Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <label htmlFor="pro-bono">Available for Pro Bono</label>
                  </div>
                  <switch id="pro-bono" />
                </div>

                <div>
                  <label className="mb-2 block">Pro Bono Hours</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Year</span>
                    <button>45 hours</button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block">Areas of Interest</label>
                  <div className="flex flex-wrap gap-2">
                    <button >Immigration</button>
                    <button >Family Law</button>
                    <button >Housing</button>
                  </div>
                </div>
                <button 
                    className='px-7 py-1 rounded-4xl text-blue-950 bg-white hover:bg-gray-100 transition-colors'
                    type='button'
                    >
                        <Award className="h-4 w-4 mr-2" />
                        Manage Pro Bono
                    </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="full-name">Full Name</label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <input id="full-name" defaultValue="John Doe" className="rounded-l-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email">Email</label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            defaultValue="john.doe@legalfirm.com"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone">Phone</label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <input id="phone" defaultValue="(555) 123-4567" className="rounded-l-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="location">Location</label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <input id="location" defaultValue="New York, NY" className="rounded-l-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bio">Biography</label>
                      <textarea
                        id="bio"
                        rows={4}
                        defaultValue="Corporate attorney with over 15 years of experience specializing in mergers and acquisitions, securities law, and corporate governance. Graduated from Harvard Law School and previously worked at top law firms in New York."
                      />
                    </div>

                    <button>Save Changes</button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="practice-areas">Practice Areas</label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <input
                            id="practice-areas"
                            defaultValue="Corporate Law, M&A, Securities"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="bar-number">Bar Number</label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <input id="bar-number" defaultValue="NY123456" className="rounded-l-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="years-practice">Years in Practice</label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <input id="years-practice" defaultValue="15" className="rounded-l-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="firm">Law Firm</label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <input id="firm" defaultValue="Smith & Associates" className="rounded-l-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="education">Education</label>
                      <textarea
                        id="education"
                        rows={3}
                        defaultValue="J.D., Harvard Law School, 2008
B.A., Political Science, Yale University, 2005"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="certifications">Certifications & Awards</label>
                      <textarea
                        id="certifications"
                        rows={3}
                        defaultValue="Board Certified in Corporate Law
Super Lawyers Rising Star, 2015-2020
New York Bar Association Excellence Award, 2018"
                      />
                    </div>

                    <button>Save Changes</button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cases" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">You currently have 5 active cases.</p>

                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((caseNum) => (
                        <div key={caseNum} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Case #{caseNum}23456</h3>
                              <p className="text-sm text-muted-foreground">Client: ABC Corporation</p>
                              <div className="flex items-center mt-2">
                                <button  className="mr-2">
                                  Corporate
                                </button>
                                <button >Contract Review</button>
                              </div>
                            </div>
                            <button className={caseNum % 2 === 0 ? "bg-yellow-500" : "bg-green-500"}>
                              {caseNum % 2 === 0 ? "In Progress" : "Active"}
                            </button>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Last Updated: </span>
                              <span>April {caseNum}, 2023</span>
                            </div>
                            <button 
                                className='px-7 py-1 rounded-4xl text-blue-950 bg-white hover:bg-gray-100 transition-colors'
                                type='button'
                                >
                                View Details
                                </button>
                            
                          </div>
                        </div>
                      ))}
                    </div>

                    <button  className="w-full">
                      View All Cases
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-4xl font-bold mr-4">4.2</div>
                        <div>
                          <div className="flex">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <Star className="h-5 w-5 text-slate-300" />
                          </div>
                          <p className="text-sm text-muted-foreground">Based on 28 reviews</p>
                        </div>
                      </div>
                      <button >Request Reviews</button>
                    </div>

                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((review) => (
                        <div key={review} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-slate-200 mr-3 overflow-hidden">
                                <img
                                  src={`/placeholder.svg?height=40&width=40&text=C${review}`}
                                  alt="Client"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">Client {review}</h3>
                                <p className="text-xs text-muted-foreground">March {review + 10}, 2023</p>
                              </div>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < 5 - (review % 2) ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-3 text-sm">
                            {review % 2 === 0
                              ? "John was extremely professional and knowledgeable. He helped us navigate a complex corporate restructuring with ease. Highly recommended!"
                              : "Very responsive and thorough in his approach. Explained complex legal matters in simple terms. Would definitely work with him again."}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button  className="w-full">
                      View All Reviews
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


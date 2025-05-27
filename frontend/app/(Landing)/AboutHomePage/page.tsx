import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  MessageSquare,
  Shield,
  Search,
  FileText,
  Star,
  CheckCircle,
  ArrowRight,
  Gavel,
  Heart,
  Clock,
  Award,
} from "lucide-react";
import FloatingButton from "@/app/components/FloatingButton"; // Updated import path to use absolute path from app root

export default function LegalPlatformLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#1e2e45]">LawConnect</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-[#1e2e45] font-medium">
              Features
            </a>
            <a href="#attorneys" className="text-gray-600 hover:text-[#1e2e45] font-medium">
              For Attorneys
            </a>
            <a href="#clients" className="text-gray-600 hover:text-[#1e2e45] font-medium">
              For Clients
            </a>
            <a href="#contact" className="text-gray-600 hover:text-[#1e2e45] font-medium">
              Contact
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="ghost" className="text-[#1e2e45] font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#1e2e45] text-white hover:bg-[#1e2e45]/90 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Floating Button */}
      <FloatingButton />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1e2e45] to-[#2d4a6d] text-white pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Uphold Truth For Justice With LawConnect
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Professional Lawyers And Advisors With More Experience
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-[#1e2e45] hover:bg-gray-100 font-medium px-8">
                    Find an Attorney
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10 font-medium px-8">
                    Join as Attorney
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="relative w-full h-[320px] overflow-hidden rounded-lg transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1470&auto=format&fit=crop"
                    alt="Professional Attorney"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative w-full h-[240px] overflow-hidden rounded-lg transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1469&auto=format&fit=crop"
                    alt="Professional Attorney"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="relative w-full h-[240px] overflow-hidden rounded-lg transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1590099033615-be195f8d575c?q=80&w=1374&auto=format&fit=crop"
                    alt="Professional Attorney"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative w-full h-[320px] overflow-hidden rounded-lg transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1374&auto=format&fit=crop"
                    alt="Professional Attorney"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Rest of the sections remain unchanged */}
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-[#1e2e45] mb-2">500+</h3>
              <p className="text-gray-600">Attorneys</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-[#1e2e45] mb-2">1000+</h3>
              <p className="text-gray-600">Cases Handled</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-[#1e2e45] mb-2">98%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-[#1e2e45] mb-2">24/7</h3>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1e2e45]">Professional Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert legal services tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <Gavel className="h-12give me the code for the floating button and its navigation in the new code w-12 text-[#1e2e45] mb-4" />
                <CardTitle className="text-xl mb-2">Business Law</CardTitle>
                <CardDescription className="text-gray-600">
                  Expert guidance on commercial and corporate legal matters
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <Shield className="h-12 w-12 text-[#1e2e45] mb-4" />
                <CardTitle className="text-xl mb-2">Criminal Law</CardTitle>
                <CardDescription className="text-gray-600">
                  Professional defense and prosecution services
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <Scale className="h-12 w-12 text-[#1e2e45] mb-4" />
                <CardTitle className="text-xl mb-2">Civil Rights</CardTitle>
                <CardDescription className="text-gray-600">
                  Protection and advocacy for individual rights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Rated Attorneys Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#1e2e45]">Top Rated Attorneys</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Meet our highest-rated legal professionals who consistently deliver exceptional service</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Samuel Haile",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1374&auto=format&fit=crop",
                rating: "4.9",
                specialty: "Business & Corporate Law",
                badges: ["Corporate", "Contracts", "Mergers"],
                experience: "15+ years",
                profile: "/attorney/samuel-haile"
              },
              {
                name: "Tigist Bekele",
                image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?q=80&w=1469&auto=format&fit=crop",
                rating: "4.8",
                specialty: "Criminal Defense",
                badges: ["Criminal Law", "Defense", "Appeals"],
                experience: "12+ years",
                profile: "/attorney/tigist-bekele"
              },
              {
                name: "Abebe Tadesse",
                image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1470&auto=format&fit=crop",
                rating: "4.7",
                specialty: "Civil Rights & Family Law",
                badges: ["Civil Rights", "Family", "Divorce"],
                experience: "10+ years",
                profile: "/attorney/abebe-tadesse"
              },
              {
                name: "Martha Alemu",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1374&auto=format&fit=crop",
                rating: "4.9",
                specialty: "Property & Real Estate",
                badges: ["Real Estate", "Property", "Land Law"],
                experience: "8+ years",
                profile: "/attorney/martha-alemu"
              }
            ].map((attorney, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={attorney.image}
                    alt={`Attorney ${attorney.name}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold">{attorney.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-[#1e2e45]">{attorney.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{attorney.specialty}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {attorney.badges.map((badge, badgeIndex) => (
                      <div key={badgeIndex} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 border-gray-200">
                        {badge}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{attorney.experience}</span>
                    <Link href={attorney.profile}>
                      <Button variant="ghost" size="sm" className="text-[#1e2e45] hover:text-[#1e2e45]/90">
                        View Profile <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[#1e2e45] text-white hover:bg-[#1e2e45]/80 mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1e2e45] tracking-tight">
              Comprehensive Legal Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced tools and features designed for the Ethiopian legal system
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Smart Attorney Search",
                description: "Find attorneys by expertise, location, availability, and ratings",
                color: "bg-blue-50"
              },
              {
                icon: MessageSquare,
                title: "AI Legal Assistant",
                description: "Get instant legal guidance tailored to Ethiopian legal frameworks",
                color: "bg-green-50"
              },
              {
                icon: Shield,
                title: "Secure Platform",
                description: "Role-based access control and secure credential verification",
                color: "bg-purple-50"
              },
              {
                icon: Heart,
                title: "Pro Bono Services",
                description: "Access to free legal services for qualifying clients",
                color: "bg-pink-50"
              },
              {
                icon: FileText,
                title: "Case Management",
                description: "Track requests, manage consultations, and store documents securely",
                color: "bg-yellow-50"
              },
              {
                icon: Star,
                title: "Rating System",
                description: "Transparent ratings and reviews for quality assurance",
                color: "bg-orange-50"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={"bg-gradient-to-br " + feature.color + " p-6 h-full transition-all duration-300 group-hover:bg-[#1e2e45]"}>
                    <div className="relative z-10">
                      <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/90 group-hover:bg-white/10 transition-colors duration-300">
                          <Icon className="w-6 h-6 text-[#1e2e45] group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-[#1e2e45] group-hover:text-white transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1e2e45]/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Attorneys Section */}
      <section id="attorneys" className="relative py-24 bg-gradient-to-r from-[#1e2e45] to-[#2d4a6d] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-white/20 bg-white/10 text-white hover:bg-white/20 mb-4">
                For Legal Professionals
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Grow Your Legal Practice with Us
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join our platform to connect with clients, manage your practice efficiently, and contribute to pro bono legal services in Ethiopia.
              </p>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors duration-300">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Secure Registration</h4>
                    <p className="text-gray-300">
                      Upload and verify professional credentials through our secure verification process
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors duration-300">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Smart Case Management</h4>
                    <p className="text-gray-300">
                      Efficiently manage consultations and case requests with our intuitive dashboard
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors duration-300">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Pro Bono Impact</h4>
                    <p className="text-gray-300">
                      Make a difference in your community through our structured pro bono program
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/signup" passHref legacyBehavior>
                <Button size="lg" className="bg-white text-[#1e2e45] hover:bg-white/90 font-semibold text-lg px-8 py-6">
                  Join as Attorney
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Gavel className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Professional Dashboard</h4>
                      <p className="text-gray-300">
                        Comprehensive tools for case and client management
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Flexible Scheduling</h4>
                      <p className="text-gray-300">
                        Control your availability and consultation hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Build Your Reputation</h4>
                      <p className="text-gray-300">
                        Showcase your expertise with verified reviews and ratings
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1374&auto=format&fit=crop" alt="Attorney" />
                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?q=80&w=1469&auto=format&fit=crop" alt="Attorney" />
                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1470&auto=format&fit=crop" alt="Attorney" />
                      </div>
                      <span className="text-gray-300">Join 500+ attorneys</span>
                    </div>
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* For Clients Section */}
      <section id="clients" className="relative py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-[#1e2e45] to-[#2d4a6d] rounded-2xl p-8 shadow-2xl text-white">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors duration-300">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Search className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Find the Right Attorney</h4>
                      <p className="text-gray-200">
                        Search and connect with experienced attorneys based on your legal needs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors duration-300">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">AI Legal Guidance</h4>
                      <p className="text-gray-200">
                        Get instant answers to your legal questions through our AI assistant
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors duration-300">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Case Tracking</h4>
                      <p className="text-gray-200">
                        Monitor your case progress and stay updated with real-time notifications
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <Shield className="h-6 w-6 text-green-400" />
                      </div>
                      <span className="text-gray-200">Secure & Confidential</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#1e2e45]/20 to-[#2d4a6d]/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#2d4a6d]/20 to-[#1e2e45]/20 rounded-full blur-3xl"></div>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-[#1e2e45]/20 bg-[#1e2e45]/5 text-[#1e2e45] hover:bg-[#1e2e45]/10 mb-4">
                For Clients
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#1e2e45] leading-tight">
                Get Expert Legal Help When You Need It
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Access qualified attorneys, submit legal requests, and get AI-powered guidance tailored to Ethiopian law. Pro bono services available for qualifying cases.
              </p>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4 bg-[#1e2e45]/5 p-4 rounded-xl hover:bg-[#1e2e45]/10 transition-colors duration-300">
                  <div className="bg-[#1e2e45]/10 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1e2e45] text-lg">Quick Registration</h4>
                    <p className="text-gray-600">
                      Create your account in minutes with our streamlined process
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-[#1e2e45]/5 p-4 rounded-xl hover:bg-[#1e2e45]/10 transition-colors duration-300">
                  <div className="bg-[#1e2e45]/10 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1e2e45] text-lg">Detailed Case Submission</h4>
                    <p className="text-gray-600">
                      Submit your case details and documents securely through our platform
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-[#1e2e45]/5 p-4 rounded-xl hover:bg-[#1e2e45]/10 transition-colors duration-300">
                  <div className="bg-[#1e2e45]/10 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1e2e45] text-lg">Pro Bono Support</h4>
                    <p className="text-gray-600">
                      Access free legal services if you qualify for our pro bono program
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/signup" passHref legacyBehavior>
                <Button size="lg" className="bg-[#1e2e45] text-white hover:bg-[#1e2e45]/90 font-semibold text-lg px-8 py-6">
                  Find Legal Help Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors border-[#1e2e45]/20 bg-[#1e2e45]/5 text-[#1e2e45] hover:bg-[#1e2e45]/10 mb-4">
                AI-Powered Legal Support
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e2e45] leading-tight">
                24/7 Legal Assistant at Your Service
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Get instant legal guidance through our AI chatbot, powered by Ethiopian legal frameworks. Perfect for preliminary research before connecting with an attorney.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
              <div className="bg-gradient-to-r from-[#1e2e45] to-[#2d4a6d] p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 p-3 rounded-full">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Legal AI Assistant</h3>
                    <p className="text-gray-300">Your 24/7 legal research companion</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 rounded-2xl p-4 flex-1">
                    <p className="text-[#1e2e45] font-medium">
                      "What are the requirements for starting a business in Ethiopia?"
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-[#1e2e45]/5 rounded-2xl p-4 flex-1">
                    <p className="text-gray-700">
                      Based on Ethiopian commercial law, here are the key requirements for business registration:
                      <ul className="mt-2 space-y-2 list-disc list-inside text-gray-600">
                        <li>Valid business name and registration</li>
                        <li>Tax identification number (TIN)</li>
                        <li>Required capital verification</li>
                        <li>Business license application</li>
                      </ul>
                    </p>
                  </div>
                </div>
                <Link href="/ai-chatbot" passHref legacyBehavior>
                  <Button className="w-full bg-[#1e2e45] text-white hover:bg-[#1e2e45]/90 py-6 text-lg font-semibold">
                    Try AI Assistant Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors border-[#1e2e45]/20 bg-[#1e2e45]/5 text-[#1e2e45] hover:bg-[#1e2e45]/10 mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e2e45]">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get legal assistance in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Register & Search",
                description: "Create your account and search for attorneys by expertise and location",
                icon: Search,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "2",
                title: "Submit Request",
                description: "Submit your legal assistance request with case details and documents",
                icon: FileText,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "3",
                title: "Get Connected",
                description: "Connect with qualified attorneys and track your case progress",
                icon: CheckCircle,
                color: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative z-10">
                    <div className="mb-6">
                      <div className={"w-16 h-16 rounded-xl bg-gradient-to-r " + item.color + " flex items-center justify-center mb-2 transform group-hover:scale-110 transition-transform duration-300"}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-[#1e2e45] flex items-center justify-center text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1e2e45] mb-4">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div className={"absolute inset-0 bg-gradient-to-r " + item.color + " opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-[#1e2e45] to-[#2d4a6d] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Ready to Get Started with LegalConnect?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of clients and attorneys using our platform for legal assistance in Ethiopia. Experience the future of legal services today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/signup" passHref legacyBehavior>
                <Button size="lg" className="bg-white text-[#1e2e45] hover:bg-white/90 font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Legal Help Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup" passHref legacyBehavior>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6">
                  Join as Attorney
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Secure Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">Top Rated Service</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">
                  LegalConnect
                </span>
              </div>
              <p className="text-gray-300">
                Smart legal assistance platform connecting clients with
                qualified attorneys in Ethiopia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/find-attorney" className="hover:text-white">
                    Find Attorneys
                  </Link>
                </li>
                <li>
                  <Link href="/ai-chatbot" className="hover:text-white">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/pro-bono" className="hover:text-white">
                    Pro Bono Services
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Case Management
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: support@legalconnect.et</li>
                <li>Phone: +251-11-876-9874</li>
                <li>Address: Addis Ababa, Ethiopia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-gray-300">
            <p>© 2024 LegalConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LegalConnect</h3>
            <p className="text-slate-300 mb-4">Connecting attorneys and clients for better legal services.</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/attorneys" className="text-slate-300 hover:text-white transition-colors">
                  Find Attorneys
                </Link>
              </li>
              <li>
                <Link href="/laws" className="text-slate-300 hover:text-white transition-colors">
                  Law Search
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Attorneys</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/attorney/register" className="text-slate-300 hover:text-white transition-colors">
                  Join as Attorney
                </Link>
              </li>
              <li>
                <Link href="/attorney/profile" className="text-slate-300 hover:text-white transition-colors">
                  Attorney Profile
                </Link>
              </li>
              <li>
                <Link href="/attorney/notifications" className="text-slate-300 hover:text-white transition-colors">
                  Client Requests
                </Link>
              </li>
              <li>
                <Link href="/attorney/pro-bono" className="text-slate-300 hover:text-white transition-colors">
                  Pro Bono Work
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-slate-300 mb-4">Subscribe to our newsletter for legal updates and news.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-slate-800 border-slate-700 text-white" />
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} LegalConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


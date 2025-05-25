"use client";

import React, { useState, useEffect } from "react";
import RequestConsultationModal from "../../components/requestConsultationModal"; // Import the modal component
// import NavbarClient from "@/components/navbar"; // Uncomment if you need your navbar
// import { Navbar } from "@/components/navbar copy"; // Uncomment if you need your navbar
import { Search, MapPin, Clock, Star, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui button
import { Skeleton } from "@/components/ui/skeleton"; // For loading state placeholders

interface Attorney {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    image: string;
    created_at: string;
    updated_at: string;
  };
  starting_price: number | null;
  is_available: boolean;
  offers_probono: boolean;
  address: string;
  rating: number;
  profile_completion: number;
  license_document: string;
  is_approved: boolean;
  expertise: string[];
}

export default function FindAttorney() {
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(
    null
  ); // State to store the attorney for consultation
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [authToken, setAuthToken] = useState<string | null>(null); // State to hold the access token

  const router = useRouter();

  // Effect to fetch and set authentication token from localStorage
  // This runs once on component mount to get the initial token status.
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAuthToken(token);
  }, []);

  // Function to fetch attorneys from API
  const fetchAttorneys = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("access_token");
    // Ensure authToken state is updated here too, in case it was set after initial useEffect
    setAuthToken(token);

    if (!token) {
      setNeedsLogin(true); // Indicate that login is required
      setIsLoading(false);
      return; // Stop execution if no token
    }

    try {
      const response = await fetch(
        "https://main-backend-aan1.onrender.com/api/attorney/list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use the token for authorization
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "No response body");
        if (response.status === 401) {
          // Handle 401 Unauthorized: token expired or invalid
          localStorage.removeItem("access_token"); // Clear invalid token
          setNeedsLogin(true); // Set state to show login prompt
          setError("Session expired. Please log in again."); // Set specific error message
          // Redirect to login page after a short delay for user to read message
          setTimeout(() => {
            router.push("/login?redirect=/find-attorney");
          }, 2000);
          return; // Stop execution
        }
        // For other HTTP errors, throw a generic error
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const data: Attorney[] = await response.json();
      setAttorneys(data); // Update attorneys state with fetched data
    } catch (err) {
      // Catch any network or parsing errors
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching attorneys";
      setError(errorMessage); // Set error message
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false); // Always set loading to false after fetch attempt
    }
  };

  // Fetch attorneys on initial component mount
  useEffect(() => {
    fetchAttorneys();
  }, []); // Empty dependency array ensures this runs only once

  // Handler to open the consultation modal when "Request Consultation" button is clicked
  const handleRequestConsultation = (attorney: Attorney) => {
    if (!authToken) {
      // If no authentication token is present, alert user and redirect to login
      alert("You need to log in to request a consultation.");
      router.push("/login?redirect=/find-attorney");
      return;
    }
    setSelectedAttorney(attorney); // Set the attorney object to be passed to the modal
    setIsModalOpen(true); // Open the modal
  };

  // Handler to close the consultation modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedAttorney(null); // Clear the selected attorney when modal closes
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header (e.g., your Navbar component would go here if uncommented) */}
      {/* <NavbarClient /> */}
      {/* <Navbar /> */}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Find an Attorney</h1>

        {/* Search Bar Section */}
        <div className="flex mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search Attorney"
              className="w-full border border-[#e4e4e7] rounded-l-lg py-3 px-10 focus:outline-none"
            />
            <Search className="absolute left-3 top-3.5 text-[#a3a3a3] w-5 h-5" />
          </div>
          <button className="bg-[#1e2e45] text-white px-6 py-3 rounded-r-lg font-medium">
            Search
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white border border-[#e4e4e7] rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Practice Areas Filter */}
            <div>
              <h3 className="font-medium mb-3">Practice Areas</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 h-4 w-4" />
                  <span>Constitutional</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mr-2 h-4 w-4"
                  />
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

            {/* Location Filter */}
            <div>
              <h3 className="font-medium mb-3">Location</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mr-2 h-4 w-4"
                  />
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

            {/* Experience Filter */}
            <div>
              <h3 className="font-medium mb-3">Experience</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mr-2 h-4 w-4"
                  />
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

            {/* Rating Filter */}
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
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mr-2 h-4 w-4"
                    />
                    <span>Gives Pro bono Service</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Action Buttons */}
          <div className="flex justify-end mt-6 space-x-3">
            <button className="px-4 py-2 border border-[#e4e4e7] rounded text-sm">
              Reset Filters
            </button>
            <button className="px-4 py-2 bg-[#1e2e45] text-white rounded text-sm">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results Overview and Sort By */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-[#71717a]">
            {isLoading ? "Loading..." : `Showing ${attorneys.length} attorneys`}
          </p>
          <div className="flex items-center">
            <span className="text-sm mr-2">Sort by:</span>
            <select className="border border-[#e4e4e7] rounded py-1 px-3 bg-[#f8fafc] text-sm">
              <option>Relevance</option>
              <option>Rating</option>
              <option>Experience</option>
            </select>
          </div>
        </div>

        {/* Conditional Rendering for Loading, Login Prompt, Error, or No Attorneys */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#e4e4e7] rounded-lg p-6 mb-4 flex w-full"
              >
                <div className="mr-6">
                  <Skeleton className="w-32 h-32 rounded-md object-cover mb-2" />
                  <Skeleton className="h-6 w-24 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-10 w-3/4 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {needsLogin && !isLoading && (
          <div className="text-center text-[#71717a] mb-4">
            Please{" "}
            <Link
              href="/login?redirect=/find-attorney"
              className="text-blue-600 underline"
            >
              log in
            </Link>{" "}
            to view attorneys.
          </div>
        )}
        {error && !needsLogin && !isLoading && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        {!isLoading && attorneys.length === 0 && !error && !needsLogin && (
          <div className="text-center text-[#71717a]">No attorneys found</div>
        )}

        {/* Attorney List Display */}
        {!isLoading && attorneys.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {attorneys.map((attorney) => (
              <div
                key={attorney.id}
                className="bg-white border border-[#e4e4e7] rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start w-full"
              >
                <div className="mr-0 md:mr-6 mb-4 md:mb-0 flex-shrink-0">
                  {attorney.user.image ? (
                    <Image
                      src={attorney.user.image}
                      alt={`${attorney.user.first_name} ${attorney.user.last_name}`}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-[#dddddd] rounded-md flex items-center justify-center">
                      <span className="text-2xl text-[#a3a3a3]">No Image</span>
                    </div>
                  )}
                  <h3 className="font-bold text-center mt-2">
                    {attorney.user.first_name} {attorney.user.last_name}
                  </h3>
                  <div className="flex justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < Math.floor(attorney.rating)
                            ? "fill-[#eab308] text-[#eab308]"
                            : "text-[#eab308]"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm">
                      {attorney.rating.toFixed(1)}
                    </span>
                  </div>
                  {attorney.is_approved && (
                    <div className="flex justify-center mt-1">
                      <span className="bg-[#4ade80]/20 text-[#4ade80] text-xs px-2 py-1 rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Approved
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <div className="flex mb-3 space-x-3 flex-wrap justify-center md:justify-start">
                    {attorney.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="bg-[#f8fafc] text-xs px-3 py-1 rounded-full mb-2"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 mb-3 text-center md:text-left">
                    <div className="flex items-center text-sm justify-center md:justify-start">
                      <MapPin className="w-4 h-4 mr-2 text-[#71717a]" />
                      <span>
                        {attorney.address || "Location not specified"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm justify-center md:justify-start">
                      <Clock className="w-4 h-4 mr-2 text-[#71717a]" />
                      <span>
                        {attorney.user.created_at
                          ? `${
                              new Date().getFullYear() -
                              new Date(attorney.user.created_at).getFullYear()
                            } years experience`
                          : "Experience not specified"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm justify-center md:justify-start">
                      <Clock className="w-4 h-4 mr-2 text-[#71717a]" />
                      <span>
                        {attorney.is_available
                          ? "Available"
                          : "Limited availability"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#71717a] mb-4 text-center md:text-left">
                    {attorney.expertise.join(", ")} specialist.{" "}
                    {attorney.offers_probono ? "Offers pro bono services." : ""}
                  </p>

                  <div className="flex space-x-3 justify-center md:justify-start">
                    <Link
                      href={`/attorney/${attorney.id}`}
                      className="bg-[#18181b] text-white px-6 py-2 rounded text-sm hover:bg-[#18181b]/90 transition-colors"
                    >
                      View Profile
                    </Link>
                    <Button
                      onClick={() => handleRequestConsultation(attorney)}
                      className="border border-[#e4e4e7] px-6 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
                      disabled={!authToken}
                    >
                      Request Consultation
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* The RequestConsultationModal component, rendered conditionally */}
      <RequestConsultationModal
        attorney={selectedAttorney} // Pass the selected attorney data
        isOpen={isModalOpen} // Control modal visibility
        onClose={handleCloseModal} // Function to close the modal
        authToken={authToken} // Pass the authentication token to the modal
      />
    </div>
  );
}

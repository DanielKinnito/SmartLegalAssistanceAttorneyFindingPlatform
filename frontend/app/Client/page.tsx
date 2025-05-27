"use client";

import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import RequestConsultationModal from "../../components/requestConsultationModal";
import Header from "../../components/Header";
import { Search, MapPin, Clock, Star, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Attorney {
  id: string;
  user: {
    id: string;
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
  const [filteredAttorneys, setFilteredAttorneys] = useState<Attorney[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    practiceAreas: [] as string[],
    locations: [] as string[],
    experience: [] as string[],
    proBonoOnly: false,
  });

  const router = useRouter();

  // Effect to fetch and set authentication token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAuthToken(token);
  }, []);

  // Function to fetch attorneys from API
  const fetchAttorneys = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("access_token");
    setAuthToken(token);

    if (!token) {
      setNeedsLogin(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://main-backend-aan1.onrender.com/api/attorney/list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "No response body");
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          setNeedsLogin(true);
          setError("Session expired. Please sign in again.");
          setTimeout(() => {
            router.push("/signin?redirect=/find-attorney");
          }, 2000);
          return;
        }
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const data: Attorney[] = await response.json();
      setAttorneys(data);
      setFilteredAttorneys(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching attorneys";
      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttorneys();
  }, []);

  // Function to handle search and filtering
  const applyFilters = () => {
    if (!attorneys.length) return;

    let filtered = [...attorneys];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (attorney) =>
          attorney.user.first_name.toLowerCase().includes(query) ||
          attorney.user.last_name.toLowerCase().includes(query) ||
          attorney.expertise.some((exp) => exp.toLowerCase().includes(query))
      );
    }

    if (filters.practiceAreas.length > 0) {
      filtered = filtered.filter((attorney) =>
        attorney.expertise.some((exp) => filters.practiceAreas.includes(exp))
      );
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter((attorney) =>
        filters.locations.includes(attorney.address)
      );
    }

    if (filters.experience.length > 0) {
      filtered = filtered.filter((attorney) => {
        const yearsExp = attorney.user.created_at
          ? new Date().getFullYear() -
            new Date(attorney.user.created_at).getFullYear()
          : 0;
        return filters.experience.some((range) => {
          switch (range) {
            case "0-2":
              return yearsExp >= 0 && yearsExp <= 2;
            case "2-5":
              return yearsExp > 2 && yearsExp <= 5;
            case "5-10":
              return yearsExp > 5 && yearsExp <= 10;
            case "10+":
              return yearsExp > 10;
            default:
              return false;
          }
        });
      });
    }

    if (filters.proBonoOnly) {
      filtered = filtered.filter((attorney) => attorney.offers_probono);
    }

    setFilteredAttorneys(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [attorneys, searchQuery, filters]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePracticeAreaChange = (area: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      practiceAreas: checked
        ? [...prev.practiceAreas, area]
        : prev.practiceAreas.filter((a) => a !== area),
    }));
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      locations: checked
        ? [...prev.locations, location]
        : prev.locations.filter((l) => l !== location),
    }));
  };

  const handleExperienceChange = (range: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      experience: checked
        ? [...prev.experience, range]
        : prev.experience.filter((r) => r !== range),
    }));
  };

  const handleProBonoChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("proBonoOnly", e.target.checked);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const attorneys = [...filteredAttorneys];
    switch (e.target.value) {
      case "rating":
        attorneys.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        attorneys.sort((a, b) => {
          const aExp = a.user.created_at
            ? new Date().getFullYear() -
              new Date(a.user.created_at).getFullYear()
            : 0;
          const bExp = b.user.created_at
            ? new Date().getFullYear() -
              new Date(b.user.created_at).getFullYear()
            : 0;
          return bExp - aExp;
        });
        break;
      default:
        break;
    }
    setFilteredAttorneys(attorneys);
  };

  const handleApplyFilters = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    applyFilters();
  };

  const handleResetFilters = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    resetFilters();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      practiceAreas: [],
      locations: [],
      experience: [],
      proBonoOnly: false,
    });
    setFilteredAttorneys(attorneys);
  };

  const handleRequestConsultation = (attorney: Attorney) => {
    if (!authToken) {
      alert("You need to sign in to request a consultation.");
      router.push("/signin?redirect=/find-attorney");
      return;
    }
    setSelectedAttorney(attorney);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAttorney(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header with logout handler */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pt-16">
        <h1 className="text-2xl font-bold mb-6">Find an Attorney</h1>

        <div className="flex mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search Attorney"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border border-[#e4e4e7] rounded-l-lg py-3 px-10 focus:outline-none"
            />
            <Search className="absolute left-3 top-3.5 text-[#a3a3a3] w-5 h-5" />
          </div>
          <button
            onClick={handleApplyFilters}
            className="bg-[#1e2e45] text-white px-6 py-3 rounded-r-lg font-medium"
          >
            Search
          </button>
        </div>

        <div className="bg-white border border-[#e4e4e7] rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2 text-sm">Practice Areas</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  "Constitutional",
                  "Civil",
                  "Criminal",
                  "Commercial",
                  "Labor",
                  "Family",
                  "Land",
                  "Investment",
                  "Human Rights",
                ].map((area) => (
                  <label key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.practiceAreas.includes(area)}
                      onChange={(e) =>
                        handlePracticeAreaChange(area, e.target.checked)
                      }
                      className="mr-1.5 h-3.5 w-3.5"
                    />
                    <span className="text-gray-600">{area}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">Location</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {["Addis Ababa", "Adama", "Dire Dawa", "Hawassa"].map(
                  (location) => (
                    <label key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.locations.includes(location)}
                        onChange={(e) =>
                          handleLocationChange(location, e.target.checked)
                        }
                        className="mr-1.5 h-3.5 w-3.5"
                      />
                      <span className="text-gray-600">{location}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">Experience</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: "0-2 Years", value: "0-2" },
                  { label: "2-5 Years", value: "2-5" },
                  { label: "5-10 Years", value: "5-10" },
                  { label: "10+ Years", value: "10+" },
                ].map((exp) => (
                  <label key={exp.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.experience.includes(exp.value)}
                      onChange={(e) =>
                        handleExperienceChange(exp.value, e.target.checked)
                      }
                      className="mr-1.5 h-3.5 w-3.5"
                    />
                    <span className="text-gray-600">{exp.label}</span>
                  </label>
                ))}
              </div>
              <label className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={filters.proBonoOnly}
                  onChange={handleProBonoChange}
                  className="mr-1.5 h-3.5 w-3.5"
                />
                <span className="text-gray-600 text-sm">Pro bono Service</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 border border-[#e4e4e7] rounded text-xs hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-3 py-1.5 bg-[#1e2e45] text-white rounded text-xs hover:bg-[#1e2e45]/90"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-[#71717a]">
            {isLoading
              ? "Loading..."
              : `Showing ${filteredAttorneys.length} attorneys`}
          </p>
          <div className="flex items-center">
            <span className="text-sm mr-2">Sort by:</span>
            <select
              className="border border-[#e4e4e7] rounded py-1 px-3 bg-[#f8fafc] text-sm"
              onChange={handleSortChange}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
            </select>
          </div>
        </div>

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
              href="/signin?redirect=/find-attorney"
              className="text-blue-600 underline"
            >
              sign in
            </Link>{" "}
            to view attorneys.
          </div>
        )}
        {error && !needsLogin && !isLoading && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        {!isLoading &&
          filteredAttorneys.length === 0 &&
          !error &&
          !needsLogin && (
            <div className="text-center text-[#71717a]">No attorneys found</div>
          )}

        {!isLoading && filteredAttorneys.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {filteredAttorneys.map((attorney) => (
              <div
                key={attorney.id}
                className="bg-white border border-[#e4e4e7] rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start w-full"
              >
                <div className="mr-0 md:mr-6 mb-4 md:mb-0 flex-shrink-0">
                  {attorney.user.image ? (
                    <img
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
                      href={`/Client/attorney/${attorney.user.id}`}
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

      <RequestConsultationModal
        attorney={selectedAttorney}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        authToken={authToken}
      />
    </div>
  );
}

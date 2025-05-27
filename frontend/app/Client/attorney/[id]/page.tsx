"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import React from "react";
import {
  Star,
  CheckCircle,
  Clock,
  MapPin,
  Building,
  FileText,
  GraduationCap,
  Award,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Education {
  id: string;
  institution: string;
  degree: string;
  year: number;
}

interface Experience {
  id: string;
  organization: string;
  title: string;
  years: number;
}

interface Attorney {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string;
  attorney: {
    id: string;
    starting_price: number | null;
    is_available: boolean;
    offers_probono: boolean;
    address: string;
    rating: number;
    profile_completion: number;
    license_document: string;
    is_approved: boolean;
    expertise: string[];
    education: Education[];
    experience: Experience[];
  };
}

export default function AttorneyProfile({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAuthToken(token);
  }, []);

  useEffect(() => {
    const fetchAttorney = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("access_token");
      setAuthToken(token);

      if (!token) {
        setError("You must be logged in to view attorney details.");
        setIsLoading(false);
        setTimeout(() => {
          router.push(`/login?redirect=/attorney/${params.id}`);
        }, 2000);
        return;
      }

      try {
        const response = await fetch(
          `https://main-backend-aan1.onrender.com/api/attorney/available/${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response
            .text()
            .catch(() => "No response body");
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            setError("Session expired. Please log in again.");
            setTimeout(() => {
              router.push(`/login?redirect=/attorney/${params.id}`);
            }, 2000);
            return;
          }
          throw new Error(
            `HTTP ${response.status}: ${response.statusText}. ${errorText}`
          );
        }

        const data: Attorney = await response.json();
        console.log("API /attorney/available response:", data); // Debug log
        setAttorney(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching attorney details";
        setError(errorMessage);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchAttorney();
    } else {
      setError("Invalid attorney ID");
      setIsLoading(false);
    }
  }, [params.id, router]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Attorney Profile</h1>

        {isLoading && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-36 w-full rounded-lg" />
            </div>
            <div className="w-full md:w-3/4 space-y-6">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-80 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        {attorney && !isLoading && !error && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4 space-y-6">
              <div className="bg-white border border-[#e4e4e7] rounded-lg p-6">
                <div className="flex flex-col items-center">
                  {attorney.image ? (
                    <img
                      src={attorney.image}
                      alt={`${attorney.first_name} ${attorney.last_name}`}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-md object-cover mb-4"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-[#dddddd] rounded-md flex items-center justify-center mb-4">
                      <span className="text-2xl text-[#a3a3a3]">No Image</span>
                    </div>
                  )}
                  <h2 className="text-xl font-bold">
                    {attorney.first_name} {attorney.last_name}, Esq.
                  </h2>
                  <p className="text-[#71717a] text-sm">
                    {attorney.attorney.expertise.join(", ")} Specialist
                  </p>
                  <div className="flex items-center mt-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < Math.floor(attorney.attorney.rating)
                            ? "fill-[#eab308] text-[#eab308]"
                            : "text-[#eab308] fill-transparent"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm">
                      ({attorney.attorney.rating.toFixed(1)})
                    </span>
                  </div>
                  {attorney.attorney.is_approved && (
                    <div className="mt-2">
                      <span className="bg-[#4ade80]/20 text-[#4ade80] text-xs px-2 py-1 rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Approved
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-[#e4e4e7] rounded-lg p-6">
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Working Hours</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#71717a]">Monday - Friday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#71717a]">Saturday</span>
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#71717a]">Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            <div className="w-full md:w-3/4">
              <div className="flex border-b border-[#e4e4e7] mb-6">
                <button className="px-6 py-3 border-b-2 border-[#1e2e45] font-medium">
                  Profile
                </button>
                <button className="px-6 py-3 text-[#71717a]">Cases</button>
                <button className="px-6 py-3 text-[#71717a]">Reviews</button>
              </div>

              <div className="bg-white border border-[#e4e4e7] rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                      <span className="text-[#71717a] mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                      <span>
                        {attorney.first_name} {attorney.last_name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                      <span className="text-[#71717a] mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="20"
                            height="16"
                            x="2"
                            y="4"
                            rx="2"
                          ></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                      </span>
                      <span>{attorney.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                      <span className="text-[#71717a] mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </span>
                      <span>Not specified</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                      <span className="text-[#71717a] mr-2">
                        <MapPin size={20} />
                      </span>
                      <span>
                        {attorney.attorney.address || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Biography
                  </label>
                  <div className="border border-[#e4e4e7] rounded-md p-3">
                    <p className="text-sm">
                      {attorney.attorney.profile_completion > 0
                        ? `Experienced attorney specializing in ${attorney.attorney.expertise.join(
                            ", "
                          )}.`
                        : "Biography not provided."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e4e4e7] rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">
                  Professional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Practice Areas
                    </label>
                    <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                      <span className="text-[#71717a] mr-2">
                        <Building size={20} />
                      </span>
                      <span>{attorney.attorney.expertise.join(", ")}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bar Number
                    </label>
                    <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                      <span className="text-[#71717a] mr-2">
                        <FileText size={20} />
                      </span>
                      <span>Not specified</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Years in Practice
                    </label>
                    <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                      <span className="text-[#71717a] mr-2">
                        <Clock size={20} />
                      </span>
                      <span>
                        {attorney.attorney.experience.reduce(
                          (total, exp) => total + exp.years,
                          0
                        ) || "Not specified"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Law Firm
                    </label>
                    <div className="flex items-center border border-[#e4e4e7] rounded-md p-3">
                      <span className="text-[#71717a] mr-2">
                        <Building size={20} />
                      </span>
                      <span>
                        {attorney.attorney.experience[0]?.organization ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Education
                  </label>
                  <div className="border border-[#e4e4e7] rounded-md p-3">
                    <div className="flex items-start">
                      <span className="text-[#71717a] mr-2 mt-1">
                        <GraduationCap size={20} />
                      </span>
                      <span>
                        {attorney.attorney.education.length > 0
                          ? attorney.attorney.education
                              .map(
                                (edu) =>
                                  `${edu.degree}, ${edu.institution}, ${edu.year}`
                              )
                              .join("; ")
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Certifications & Awards
                  </label>
                  <div className="border border-[#e4e4e7] rounded-md p-3">
                    <div className="flex items-start">
                      <span className="text-[#71717a] mr-2 mt-1">
                        <Award size={20} />
                      </span>
                      <span>Not specified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e4e4e7] rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Reviews</h2>
                <div className="text-center text-[#71717a]">
                  No reviews available for this attorney.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
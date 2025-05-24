"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchEducationAndExperience, logout } from "@/app/services/attorney_api";
import Sidebar from "./Sidebar";
import PersonalInfo from "./PersonalInfo";
import EducationSection from "./EducationSection";
import Tabs from "./Tabs";
import ExperienceSection from "./ExperienceSection";

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string | number;
}

export interface Experience {
  id: string;
  organization: string;
  title: string;
  years: string | number;
}

interface EducationExperienceResponse {
  success: boolean;
  message: string;
  data: {
    education: Education[];
    experience: Experience[];
  };
  error: any[];
  statuscode: number;
}

export default function AttorneyProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "cases">("profile");
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Retrieve token, role, and userId from localStorage
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  // Use userId as attorneyid
  const attorneyid = userId || "12345"; // Fallback to placeholder if userId is missing

  useEffect(() => {
    // Check authentication
    if (!token || userRole !== "attorney") {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchEducationAndExperience(attorneyid) as EducationExperienceResponse;
        
        if (!response.success || response.statuscode !== 200) {
          throw new Error(response.message || "Failed to fetch data");
        }

        if (!response.data) {
          throw new Error("No data received from server");
        }

        // Process education data
        const normalizedEducation = response.data.education.map(edu => ({
          ...edu,
          year: String(edu.year),
        }));

        // Process experience data
        const normalizedExperience = response.data.experience.map(exp => ({
          ...exp,
          years: String(exp.years),
        }));

        setEducationData(normalizedEducation);
        setExperienceData(normalizedExperience);
        setError(null);
      } catch (error) {
        console.error("Error fetching education and experience:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch data");
        setEducationData([]);
        setExperienceData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [attorneyid, token, userRole, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-blue-950 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-blue-950 text-white">Error: {error}</div>;
  }

  return (
    <div className="px-30 grid grid-cols-1 lg:grid-cols-4 gap-50">
      <Sidebar onLogout={handleLogout} />
      <div className="lg:col-span-3 space-y-6">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "profile" ? (
          <div className="space-y-6">
            <PersonalInfo />
            <EducationSection
              educationData={educationData}
              setEducationData={setEducationData}
              attorneyid={attorneyid}
            />
            <ExperienceSection
              experienceData={experienceData}
              setExperienceData={setExperienceData}
              attorneyid={attorneyid}
            />
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Please visit the Legal Requests page to view and manage cases.</p>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Switch, Button, CircularProgress } from "@mui/material";
import { fetchAttorneyProfile, updateAttorneyProfile, uploadProfileImage } from "@/app/services/profile_api";
import { CameraAlt, Add, Close } from "@mui/icons-material";
import Popover from "@mui/material/Popover";
import * as React from "react";

const EXPERTISE_OPTIONS = {
  IMMIGRATION_LAW: "Immigration Law",
  EMPLOYMENT_LAW: "Employment Law",
  BANKRUPTCY_LAW: "Bankruptcy Law",
  ENVIRONMENTAL_LAW: "Environmental Law",
  HEALTHCARE_LAW: "Healthcare Law",
  INTERNATIONAL_LAW: "International Law",
  CONTRACT_LAW: "Contract Law",
  TORT_LAW: "Tort Law",
  CONSTITUTIONAL_LAW: "Constitutional Law",
  ADMINISTRATIVE_LAW: "Administrative Law",
  LABOR_LAW: "Labor Law",
  SECURITIES_LAW: "Securities Law",
  MERGERS_AND_ACQUISITIONS: "Mergers and Acquisitions",
  FAMILY_LAW: "Family Law",
  CRIMINAL_LAW: "Criminal Law",
  REAL_ESTATE_LAW: "Real Estate Law",
  INTELLECTUAL_PROPERTY_LAW: "Intellectual Property Law",
  TAX_LAW: "Tax Law",
  CIVIL_RIGHTS_LAW: "Civil Rights Law",
  ELDER_LAW: "Elder Law",
  ENTERTAINMENT_LAW: "Entertainment Law",
  SPORTS_LAW: "Sports Law",
  MILITARY_LAW: "Military Law",
  EDUCATION_LAW: "Education Law",
  ESTATE_PLANNING_LAW: "Estate Planning Law",
  PERSONAL_INJURY_LAW: "Personal Injury Law",
  AVIATION_LAW: "Aviation Law",
  MARITIME_LAW: "Maritime Law",
  ANTITRUST_LAW: "Antitrust Law",
  CYBER_LAW: "Cyber Law",
  INSURANCE_LAW: "Insurance Law",
  BANKING_LAW: "Banking Law",
  CONSUMER_PROTECTION_LAW: "Consumer Protection Law",
  DATA_PRIVACY_LAW: "Data Privacy Law",
  TECHNOLOGY_LAW: "Technology Law",
  MEDIA_LAW: "Media Law",
  HUMAN_RIGHTS_LAW: "Human Rights Law",
  FORECLOSURE_DEFENSE_LAW: "Foreclosure Defense Law",
  ASSET_PROTECTION_LAW: "Asset Protection Law",
  FOREIGN_INVESTMENT_LAW: "Foreign Investment Law",
  BIOTECHNOLOGY_LAW: "Biotechnology Law",
  PHARMACEUTICAL_LAW: "Pharmaceutical Law",
  OIL_AND_GAS_LAW: "Oil and Gas Law",
  ENERGY_LAW: "Energy Law",
  TRANSPORTATION_LAW: "Transportation Law",
  NONPROFIT_LAW: "Nonprofit Law",
  ANIMAL_LAW: "Animal Law",
  FRANCHISE_LAW: "Franchise Law",
  AGRICULTURAL_LAW: "Agricultural Law",
  FASHION_LAW: "Fashion Law",
  SPACE_LAW: "Space Law",
  ART_LAW: "Art Law",
  NATIVE_AMERICAN_LAW: "Native American Law",
  JUVENILE_LAW: "Juvenile Law",
  IMMIGRATION_COMPLIANCE_LAW: "Immigration Compliance Law",
  INFORMATION_SECURITY_LAW: "Information Security Law",
  E_COMMERCE_LAW: "E-Commerce Law",
  TRADE_LAW: "Trade Law",
  TRUSTS_AND_ESTATES_LAW: "Trusts and Estates Law",
  DRONE_LAW: "Drone Law",
  SOCIAL_SECURITY_DISABILITY_LAW: "Social Security Disability Law",
  DISABILITY_RIGHTS_LAW: "Disability Rights Law",
  INTERNET_LAW: "Internet Law",
  FORENSIC_LAW: "Forensic Law",
  WORKERS_COMPENSATION_LAW: "Workers' Compensation Law"
};

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const [available, setAvailable] = useState(false);
  const [proBono, setProBono] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileData, setProfileData] = useState<{
    name: string;
    rating: number;
    isApproved: boolean;
    image: string | null;
    expertise: string[];
  }>({
    name: "",
    rating: 0,
    isApproved: false,
    image: null,
    expertise: [],
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Fetch userId and access_token from localStorage once when component mounts
    try {
      const storedUserId = localStorage.getItem("userId");
      const storedToken = localStorage.getItem("access_token");
      if (!storedUserId || !storedToken) {
        throw new Error("No user ID or token found");
      }
      setUserId(storedUserId);
      setAccessToken(storedToken);
      loadProfile(storedUserId, storedToken);
    } catch (error) {
      console.error("Error: No token or user ID found", error);
      setError(error instanceof Error ? error.message : 'Failed to find token or user ID');
      setLoading(false);
    }
  }, []);

  const loadProfile = async (userId: string, token: string) => {
    try {
      const response = await fetchAttorneyProfile(userId, token);
      if (response.attorney_data) {
        const userData = response.attorney_data.user;
        setProfileData({
          name: `${userData.first_name} ${userData.last_name}`,
          rating: response.attorney_data.rating || 0,
          isApproved: response.attorney_data.is_approved,
          image: userData.image,
          expertise: response.attorney_data.expertise || [],
        });
        setAvailable(response.attorney_data.is_available);
        setProBono(response.attorney_data.offers_probono);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId || !accessToken) {
      setError("No file selected or missing user ID/token");
      return;
    }
    try {
      setUpdating(true);
      setError(null);
      await uploadProfileImage(userId, accessToken, file);
      const updatedProfile = await fetchAttorneyProfile(userId, accessToken);
      if (updatedProfile.attorney_data) {
        setProfileData(prev => ({
          ...prev,
          image: updatedProfile.attorney_data.user.image,
        }));
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      setError(error instanceof Error ? error.message : 'Failed to update profile image');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvailabilityChange = async () => {
    if (!userId || !accessToken) {
      setError("Missing user ID or token");
      return;
    }
    try {
      setUpdating(true);
      setError(null);
      const newAvailable = !available;
      await updateAttorneyProfile(userId, accessToken, { is_available: newAvailable });
      const updatedProfile = await fetchAttorneyProfile(userId, accessToken);
      if (updatedProfile.attorney_data) {
        setAvailable(updatedProfile.attorney_data.is_available);
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      setError(error instanceof Error ? error.message : 'Failed to update availability');
    } finally {
      setUpdating(false);
    }
  };

  const handleProBonoChange = async () => {
    if (!userId || !accessToken) {
      setError("Missing user ID or token");
      return;
    }
    try {
      setUpdating(true);
      setError(null);
      const newProBono = !proBono;
      await updateAttorneyProfile(userId, accessToken, { offers_probono: newProBono });
      const updatedProfile = await fetchAttorneyProfile(userId, accessToken);
      if (updatedProfile.attorney_data) {
        setProBono(updatedProfile.attorney_data.offers_probono);
      }
    } catch (error) {
      console.error("Error updating pro bono status:", error);
      setError(error instanceof Error ? error.message : 'Failed to update pro bono status');
    } finally {
      setUpdating(false);
    }
  };

  // Expertise popover handlers
  const handleExpertiseClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleExpertiseClose = () => {
    setAnchorEl(null);
  };
  const handleExpertiseSelect = async (value: string) => {
    setAnchorEl(null);
    setSelectedExpertise(value);
    await handleAddExpertise(value);
  };

  const handleAddExpertise = async (value?: string) => {
    const expertiseToAdd = value || selectedExpertise;
    if (!expertiseToAdd || profileData.expertise.includes(expertiseToAdd) || !userId || !accessToken) {
      if (!userId || !accessToken) {
        setError("Missing user ID or token");
      }
      return;
    }
    try {
      setUpdating(true);
      setError(null);
      const newExpertise = [...profileData.expertise, expertiseToAdd];
      await updateAttorneyProfile(userId, accessToken, { expertise: newExpertise });
      const updatedProfile = await fetchAttorneyProfile(userId, accessToken);
      if (updatedProfile.attorney_data) {
        setProfileData(prev => ({
          ...prev,
          expertise: updatedProfile.attorney_data.expertise || [],
        }));
        setSelectedExpertise("");
      }
    } catch (error) {
      console.error("Error adding expertise:", error);
      setError(error instanceof Error ? error.message : 'Failed to add expertise');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveExpertise = async (expertiseToRemove: string) => {
    if (!userId || !accessToken) {
      setError("Missing user ID or token");
      return;
    }
    try {
      setUpdating(true);
      setError(null);
      const newExpertise = profileData.expertise.filter(e => e !== expertiseToRemove);
      await updateAttorneyProfile(userId, accessToken, { expertise: newExpertise });
      const updatedProfile = await fetchAttorneyProfile(userId, accessToken);
      if (updatedProfile.attorney_data) {
        setProfileData(prev => ({
          ...prev,
          expertise: updatedProfile.attorney_data.expertise || [],
        }));
      }
    } catch (error) {
      console.error("Error removing expertise:", error);
      setError(error instanceof Error ? error.message : 'Failed to remove expertise');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="space-y-6">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-8 min-w-[280px]">
      {/* Profile Image */}
      <div className="flex flex-col items-center gap-2 relative">
        <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden mb-2 relative">
          <img
            src={profileData.image || "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"}
            alt="profilepic"
            className="w-full h-full object-cover"
          />
          <label
            htmlFor="profile-image-upload"
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 hover:opacity-100 cursor-pointer transition-opacity duration-300"
          >
            <CameraAlt className="text-white text-2xl" />
          </label>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={updating}
          />
          {updating && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 rounded-full">
              <CircularProgress size={24} sx={{ color: 'white' }} />
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold text-[#1E2E45]">{profileData.name}</h2>
        <p className="text-base text-[#374151]">Corporate Law Specialist</p>
        <div className="flex items-center gap-2 mt-1">
          {profileData.isApproved ? (
            <>
              <span className="text-green-600 text-lg">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22C55E"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span className="text-green-600 font-medium">Approved Attorney</span>
            </>
          ) : (
            <span className="text-yellow-600 font-medium">Pending Approval</span>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#1E2E45]">Areas of Expertise</h3>
          <button
            onClick={handleExpertiseClick}
            disabled={updating}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F3F6FA] hover:bg-[#E5E7EB] transition-colors"
            aria-label="Add expertise"
            type="button"
          >
            <Add style={{ color: "#1E2E45", fontSize: "1.2rem" }} />
          </button>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleExpertiseClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            PaperProps={{
              style: { minWidth: 180, borderRadius: 12, padding: 4 },
            }}
          >
            <div className="flex flex-col">
              {Object.values(EXPERTISE_OPTIONS)
                .filter((value) => !profileData.expertise.includes(value))
                .map((value) => (
                  <button
                    key={value}
                    onClick={() => handleExpertiseSelect(value)}
                    className="text-left px-4 py-2 text-sm hover:bg-[#F3F6FA] transition-colors"
                    disabled={updating}
                  >
                    {value}
                  </button>
                ))}
            </div>
          </Popover>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {profileData.expertise.length > 0 ? (
            profileData.expertise.map((expertise, index) => (
              <span
                key={index}
                className="bg-[#F3F6FA] text-[#1E2E45] px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm"
              >
                {expertise}
                <button
                  onClick={() => handleRemoveExpertise(expertise)}
                  className="ml-1 rounded-full p-0.5"
                  style={{ background: "#E5E7EB" }}
                  disabled={updating}
                  aria-label="Remove expertise"
                >
                  <Close fontSize="inherit" style={{ fontSize: "1rem", color: "#1E2E45" }} />
                </button>
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400">No expertise areas added yet.</p>
          )}
        </div>
        {error && (
          <div className="mt-4 text-red-700 text-xs bg-red-100 p-2 rounded-md border border-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Availability Toggle */}
      <div>
        <h3 className="text-sm font-semibold text-[#1E2E45] mb-1">Availability</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#374151]">Available for new clients</span>
          <Switch
            checked={available}
            onChange={handleAvailabilityChange}
            disabled={updating}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#1E2E45" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#1E2E45",
              },
            }}
          />
        </div>
      </div>

      {/* Pro Bono Toggle */}
      <div>
        <h3 className="text-sm font-semibold text-[#1E2E45] mb-1">Pro Bono Work</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#374151]">Available for Pro Bono</span>
          <Switch
            checked={proBono}
            onChange={handleProBonoChange}
            disabled={updating}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#1E2E45" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#1E2E45",
              },
            }}
          />
        </div>
      </div>

      {/* Logout Button */}
      <div>
        <Button
          variant="contained"
          onClick={onLogout}
          sx={{
            width: "100%",
            backgroundColor: "#1E2E45",
            color: "white",
            "&:hover": {
              backgroundColor: "#B91C1C",
            },
            borderRadius: "8px",
            textTransform: "none",
            padding: "10px 16px",
            fontWeight: "semibold",
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
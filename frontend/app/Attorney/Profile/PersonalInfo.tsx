"use client";
import { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress } from "@mui/material";
import { Person, Email, Phone, LocationOn } from "@mui/icons-material";
import * as React from "react";
import { fetchAttorneyProfile, updateAttorneyProfile } from "@/app/services/profile_api";

export default function PersonalInfo() {
  const [open, setOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    biography: "",
  });
  const [tempPersonalInfo, setTempPersonalInfo] = useState(personalInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("access_token");
        
        if (!userId || !token) {
          throw new Error("No user ID or token found");
        }

        console.log("Fetching profile for userId:", userId);
        const response = await fetchAttorneyProfile(userId, token);
        console.log("API Response:", response);

        if (response.attorney_data && response.attorney_data.user) {
          const userData = response.attorney_data.user;
          console.log("User Data:", userData);
          console.log("Address:", response.attorney_data.address);

          const newPersonalInfo = {
            fullName: `${userData.first_name} ${userData.last_name}`,
            email: userData.email,
            phone: "", // Phone not available in API
            location: response.attorney_data.address || "",
            biography: "", // Biography not available in API
          };
          console.log("New Personal Info:", newPersonalInfo);

          setPersonalInfo(newPersonalInfo);
          setTempPersonalInfo(newPersonalInfo);
          setError(null);
        } else {
          console.error("API Response Error:", response);
          setError('Failed to load profile data: Invalid response format');
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setError(error instanceof Error ? error.message : 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Debug log when personalInfo changes
  useEffect(() => {
    console.log("Current personalInfo:", personalInfo);
  }, [personalInfo]);

  const handleEditClick = () => setOpen(true);
  const handleModalClose = () => {
    setOpen(false);
    setUpdateError(null);
    // Reset tempPersonalInfo to current personalInfo when closing without saving
    setTempPersonalInfo(personalInfo);
  };

  const handleSaveChanges = async () => {
    try {
      setUpdating(true);
      setUpdateError(null);

      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("access_token");
      
      if (!userId || !token) {
        throw new Error("No user ID or token found");
      }

      const updateData: Record<string, string> = {};

      // Only include changed fields
      if (tempPersonalInfo.fullName !== personalInfo.fullName) {
        const nameParts = tempPersonalInfo.fullName.trim().split(/\s+/);
        updateData.first_name = nameParts[0];
        updateData.last_name = nameParts.slice(1).join(" ");
      }

      if (tempPersonalInfo.location !== personalInfo.location) {
        updateData.address = tempPersonalInfo.location;
      }

      // Only proceed if there are changes to update
      if (Object.keys(updateData).length === 0) {
        setOpen(false);
        return;
      }

      const response = await updateAttorneyProfile(userId, token, updateData);
      
      // After successful update, fetch the latest profile data
      const updatedProfile = await fetchAttorneyProfile(userId, token);
      
      if (updatedProfile.attorney_data && updatedProfile.attorney_data.user) {
        const userData = updatedProfile.attorney_data.user;
        const newPersonalInfo = {
          fullName: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          phone: tempPersonalInfo.phone,
          location: updatedProfile.attorney_data.address || "",
          biography: tempPersonalInfo.biography,
        };

        setPersonalInfo(newPersonalInfo);
        setTempPersonalInfo(newPersonalInfo);
        setOpen(false);
      } else {
        throw new Error('Failed to fetch updated profile data');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempPersonalInfo({ ...tempPersonalInfo, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ backgroundColor: "#1E2E45", "&:hover": { backgroundColor: "#16233B" } }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Personal Information</h3>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleEditClick}
            sx={{ backgroundColor: "#1E2E45", "&:hover": { backgroundColor: "#16233B" } }}
          >
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <div className="flex items-center gap-2">
            <Person className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-gray-800">{personalInfo.fullName || "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Email className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-800">{personalInfo.email || "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-800">{personalInfo.phone || "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LocationOn className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-gray-800">{personalInfo.location || "Not provided"}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Biography</p>
          <p className="text-gray-800">{personalInfo.biography || "No biography provided"}</p>
        </div>
      </div>
      <Dialog open={open} onClose={handleModalClose}>
        <DialogTitle>Edit Personal Information</DialogTitle>
        <DialogContent>
          {updateError && (
            <Alert severity="error" className="mb-4">
              {updateError}
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField
              label="Full Name"
              fullWidth
              value={tempPersonalInfo.fullName}
              onChange={handleChange}
              name="fullName"
              InputProps={{ startAdornment: <Person /> }}
            />
            <TextField
              label="Email"
              fullWidth
              value={tempPersonalInfo.email}
              onChange={handleChange}
              name="email"
              InputProps={{ startAdornment: <Email /> }}
            />
            <TextField
              label="Phone"
              fullWidth
              value={tempPersonalInfo.phone}
              onChange={handleChange}
              name="phone"
              InputProps={{ startAdornment: <Phone /> }}
            />
            <TextField
              label="Location"
              fullWidth
              value={tempPersonalInfo.location}
              onChange={handleChange}
              name="location"
              InputProps={{ startAdornment: <LocationOn /> }}
            />
          </div>
          <TextField
            label="Biography"
            fullWidth
            multiline
            value={tempPersonalInfo.biography}
            onChange={handleChange}
            name="biography"
            rows={4}
            className="mt-4"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary" disabled={updating}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveChanges} 
            variant="contained" 
            disabled={updating}
            sx={{ backgroundColor: "#1E2E45", "&:hover": { backgroundColor: "#16233B" } }}
          >
            {updating ? <CircularProgress size={24} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
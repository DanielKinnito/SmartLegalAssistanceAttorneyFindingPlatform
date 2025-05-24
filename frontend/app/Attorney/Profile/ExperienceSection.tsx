"use client";
import { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { Business, Description, AccessTime, Add } from "@mui/icons-material";
import { createEducationAndExperience, updateEducationAndExperience, deleteEducationAndExperience, fetchEducationAndExperience } from "@/app/services/attorney_api";
import { Experience } from "@/app/Attorney/profile/page";
import * as React from "react";

interface ExperienceSectionProps {
  experienceData: Experience[];
  setExperienceData: (data: Experience[]) => void;
  attorneyid: string;
}

export default function ExperienceSection({ experienceData, setExperienceData, attorneyid }: ExperienceSectionProps) {
  const [open, setOpen] = useState(false);
  const [tempExperienceEntry, setTempExperienceEntry] = useState<Omit<Experience, 'id'>>({ organization: "", title: "", years: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (experienceData) {
      setLoading(false);
    }
  }, [experienceData]);

  const handleAddExperience = () => {
    setOpen(true);
    setTempExperienceEntry({ organization: "", title: "", years: "" });
    setEditingIndex(null);
    setError(null);
  };

  const handleEditExperience = (index: number) => {
    const experience = experienceData[index];
    setOpen(true);
    setTempExperienceEntry({
      organization: experience.organization,
      title: experience.title,
      years: String(experience.years)
    });
    setEditingIndex(index);
    setError(null);
  };

  const handleModalClose = () => {
    setOpen(false);
    setEditingIndex(null);
    setError(null);
  };

  // Helper function to check if an object is "empty"
  const isEmptyObject = (obj: Record<string, string>) => {
    return Object.values(obj).every((value) => value === "");
  };

  const handleSaveExperience = async () => {
    if (!tempExperienceEntry.organization || !tempExperienceEntry.title || !tempExperienceEntry.years) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (editingIndex !== null) {
        // Update existing experience
        const experienceId = experienceData[editingIndex].id;
        const response = await updateEducationAndExperience(
          experienceId,
          {
            experience: {
              organization: tempExperienceEntry.organization,
              title: tempExperienceEntry.title,
              years: tempExperienceEntry.years
            }
          },
          token
        );

        if (response.success) {
          const updatedExperience = [...experienceData];
          updatedExperience[editingIndex] = {
            ...updatedExperience[editingIndex],
            ...tempExperienceEntry,
            years: String(tempExperienceEntry.years)
          };
          setExperienceData(updatedExperience);
          setOpen(false);
          setError(null);
          // Refresh the data from the server
          await refreshExperienceData();
        } else {
          throw new Error(response.message || "Failed to update experience");
        }
      } else {
        // Create new experience
        const response = await createEducationAndExperience(
          attorneyid,
          {
            experience: {
              organization: tempExperienceEntry.organization,
              title: tempExperienceEntry.title,
              years: tempExperienceEntry.years
            }
          }
        );

        if (response.success) {
          setExperienceData([...experienceData, {
            id: response.data.id,
            ...tempExperienceEntry,
            years: String(tempExperienceEntry.years)
          }]);
          setOpen(false);
          setError(null);
          // Refresh the data from the server
          await refreshExperienceData();
        } else {
          throw new Error(response.message || "Failed to create experience");
        }
      }
    } catch (err: any) {
      console.error("Error saving experience:", err);
      setError(err.message || "Failed to save experience. Please try again.");
    }
  };

  const handleDeleteExperience = async () => {
    if (editingIndex !== null) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Get the specific experience entry's ID
        const experienceToDelete = experienceData[editingIndex];
        if (!experienceToDelete.id) {
          throw new Error("No experience ID found");
        }

        const response = await deleteEducationAndExperience(experienceToDelete.id, token);
        if (response.statuscode === 200) {
          console.log("Delete successful, refreshing data...");
          // Refresh the data from the server
          await refreshExperienceData();
          console.log("Data refresh complete");
          setOpen(false);
          setError(null);
        } else {
          throw new Error(response.message || "Failed to delete experience");
        }
      } catch (err: any) {
        console.error("Error deleting experience:", err);
        setError(err.message || "Failed to delete experience. Please try again.");
      }
    }
  };

  const refreshExperienceData = async () => {
    try {
      console.log("Starting refresh of experience data...");
      const response = await fetchEducationAndExperience(attorneyid);
      console.log("Fetch response:", response);
      if (response.success && response.data) {
        const normalizedExperience = response.data.experience.map((exp: Experience) => ({
          ...exp,
          years: String(exp.years),
        }));
        console.log("Setting new experience data:", normalizedExperience);
        setExperienceData(normalizedExperience);
      }
    } catch (error) {
      console.error("Error refreshing experience data:", error);
      setError("Failed to refresh experience data");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempExperienceEntry((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">Loading experience data...</div>;
  }

  if (error) {
    return <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Experience</h3>
          <IconButton onClick={handleAddExperience} sx={{ backgroundColor: "#1E2E45", color: "white", "&:hover": { backgroundColor: "#16233B" } }}>
            <Add />
          </IconButton>
        </div>
        {!experienceData || experienceData.length === 0 ? (
          <p className="text-gray-600">No experience records added yet.</p>
        ) : (
          <div className="space-y-4">
            {experienceData.map((exp, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-2">
                <div className="flex items-center gap-2">
                  <Business className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Organization</p>
                    <p className="text-gray-800">{exp.organization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Description className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="text-gray-800">{exp.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <AccessTime className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Years</p>
                      <p className="text-gray-800">{String(exp.years)}</p>
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleEditExperience(index)}
                    sx={{ backgroundColor: "#1E2E45", "&:hover": { backgroundColor: "#16233B" } }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={open} onClose={handleModalClose}>
        <DialogTitle>{editingIndex !== null ? "Edit Experience" : "Add Experience"}</DialogTitle>
        <DialogContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField
              label="Organization"
              fullWidth
              value={tempExperienceEntry.organization}
              onChange={handleChange}
              name="organization"
              InputProps={{ startAdornment: <Business /> }}
            />
            <TextField
              label="Title"
              fullWidth
              value={tempExperienceEntry.title}
              onChange={handleChange}
              name="title"
              InputProps={{ startAdornment: <Description /> }}
            />
            <TextField
              label="Years"
              fullWidth
              value={tempExperienceEntry.years}
              onChange={handleChange}
              name="years"
              InputProps={{ startAdornment: <AccessTime /> }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          {editingIndex !== null && <Button onClick={handleDeleteExperience} color="error">Delete</Button>}
          <Button onClick={handleModalClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveExperience} variant="contained" sx={{ backgroundColor: "#1E2E45", "&:hover": { backgroundColor: "#16233B" } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
"use client";
import { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { Business, Description, AccessTime, Add } from "@mui/icons-material";
import { createEducationAndExperience, updateEducationAndExperience, deleteEducationAndExperience, fetchEducationAndExperience } from "@/app/services/attorney_api";
import { Education } from "@/app/Attorney/profile/page";
import * as React from "react";

interface EducationSectionProps {
  educationData: Education[];
  setEducationData: (data: Education[]) => void;
  attorneyid: string;
}

export default function EducationSection({ educationData, setEducationData, attorneyid }: EducationSectionProps) {
  const [open, setOpen] = useState(false);
  const [tempEducationEntry, setTempEducationEntry] = useState<Omit<Education, 'id'>>({ institution: "", degree: "", year: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (educationData) {
      setLoading(false);
    }
  }, [educationData]);

  const handleAddEducation = () => {
    setOpen(true);
    setTempEducationEntry({ institution: "", degree: "", year: "" });
    setEditingIndex(null);
    setError(null);
  };

  const handleEditEducation = (index: number) => {
    const education = educationData[index];
    setOpen(true);
    setTempEducationEntry({
      institution: education.institution,
      degree: education.degree,
      year: String(education.year)
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

  const handleSaveEducation = async () => {
    if (!tempEducationEntry.institution || !tempEducationEntry.degree || !tempEducationEntry.year) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (editingIndex !== null) {
        // Update existing education
        const educationId = educationData[editingIndex].id;
        const response = await updateEducationAndExperience(
          educationId,
          {
            education: {
              institution: tempEducationEntry.institution,
              degree: tempEducationEntry.degree,
              year: tempEducationEntry.year
            }
          },
          token
        );

        if (response.success) {
          const updatedEducation = [...educationData];
          updatedEducation[editingIndex] = {
            ...updatedEducation[editingIndex],
            ...tempEducationEntry,
            year: String(tempEducationEntry.year)
          };
          setEducationData(updatedEducation);
          setOpen(false);
          setError(null);
        } else {
          throw new Error(response.message || "Failed to update education");
        }
      } else {
        // Create new education
        const response = await createEducationAndExperience(
          attorneyid,
          {
            education: {
              institution: tempEducationEntry.institution,
              degree: tempEducationEntry.degree,
              year: tempEducationEntry.year
            }
          }
        );

        if (response.success) {
          setEducationData([...educationData, {
            id: response.data.id,
            ...tempEducationEntry,
            year: String(tempEducationEntry.year)
          }]);
          setOpen(false);
          setError(null);
        } else {
          throw new Error(response.message || "Failed to create education");
        }
      }
    } catch (err: any) {
      console.error("Error saving education:", err);
      setError(err.message || "Failed to save education. Please try again.");
    }
  };

  const handleDeleteEducation = async () => {
    if (editingIndex !== null) {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Get the specific education entry's ID
        const educationToDelete = educationData[editingIndex];
        if (!educationToDelete.id) {
          throw new Error("No education ID found");
        }

        console.log("Deleting education with ID:", educationToDelete.id);
        const response = await deleteEducationAndExperience(educationToDelete.id, token);

        if (response.statuscode === 200) {
          console.log("Delete successful, refreshing data...");
          // Refresh the data from the server
          await refreshEducationData();
          console.log("Data refresh complete");
          setOpen(false);
          setError(null);
        } else {
          throw new Error(response.message || "Failed to delete education");
        }
      } catch (err: any) {
        console.error("Error deleting education:", err);
        setError(err.message || "Failed to delete education. Please try again.");
      }
    }
  };

  const refreshEducationData = async () => {
    try {
      console.log("Starting refresh of education data...");
      const response = await fetchEducationAndExperience(attorneyid);
      console.log("Fetch response:", response);
      if (response.success && response.data) {
        const normalizedEducation = response.data.education.map((edu: Education) => ({
          ...edu,
          year: String(edu.year),
        }));
        console.log("Setting new education data:", normalizedEducation);
        setEducationData(normalizedEducation);
      }
    } catch (error) {
      console.error("Error refreshing education data:", error);
      setError("Failed to refresh education data");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempEducationEntry((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">Loading education data...</div>;
  }

  if (error) {
    return <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Education</h3>
          <IconButton onClick={handleAddEducation} sx={{ backgroundColor: "#1E2E45", color: "white", "&:hover": { backgroundColor: "#16233B" } }}>
            <Add />
          </IconButton>
        </div>
        {!educationData || educationData.length === 0 ? (
          <p className="text-gray-600">No education records added yet.</p>
        ) : (
          <div className="space-y-4">
            {educationData.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-2">
                <div className="flex items-center gap-2">
                  <Business className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Institution</p>
                    <p className="text-gray-800">{edu.institution}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Description className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Degree</p>
                    <p className="text-gray-800">{edu.degree}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <AccessTime className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="text-gray-800">{String(edu.year)}</p>
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleEditEducation(index)}
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
        <DialogTitle>{editingIndex !== null ? "Edit Education" : "Add Education"}</DialogTitle>
        <DialogContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField
              label="Institution"
              fullWidth
              value={tempEducationEntry.institution}
              onChange={handleChange}
              name="institution"
              InputProps={{ startAdornment: <Business /> }}
            />
            <TextField
              label="Degree"
              fullWidth
              value={tempEducationEntry.degree}
              onChange={handleChange}
              name="degree"
              InputProps={{ startAdornment: <Description /> }}
            />
            <TextField
              label="Year"
              fullWidth
              value={tempEducationEntry.year}
              onChange={handleChange}
              name="year"
              InputProps={{ startAdornment: <AccessTime /> }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          {editingIndex !== null && <Button onClick={handleDeleteEducation} color="error">Delete</Button>}
          <Button onClick={handleModalClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveEducation} variant="contained" sx={{ backgroundColor: "#1E2E45", "&:hover": { backgroundColor: "#16233B" } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
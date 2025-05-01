'use client'
import { useState } from 'react';
import { TextField, Switch, Chip, Button } from "@mui/material";
import { Email, Phone, LocationOn, Person, Gavel, Business, AccessTime, Description } from "@mui/icons-material";

export default function AttorneyProfile() {
  const [available, setAvailable] = useState(true);
  const [proBono, setProBono] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const renderMainContent = () => {
    if (activeTab === 'cases') {
      const cases = [
        {
          id: 1,
          title: "Business Formation & Compliance",
          description: "Assisted a startup in structuring its legal entity, ensuring full regulatory compliance.",
        },
        {
          id: 2,
          title: "Business Formation & Compliance",
          description: "Assisted a startup in structuring its legal entity, ensuring full regulatory compliance.",
        },
        {
          id: 3,
          title: "Business Formation & Compliance",
          description: "Assisted a startup in structuring its legal entity, ensuring full regulatory compliance.",
        },
        {
          id: 4,
          title: "Business Formation & Compliance",
          description: "Assisted a startup in structuring its legal entity, ensuring full regulatory compliance.",
        },
      ];

      return (
        <div className="space-y-6">
          {cases.map((caseItem) => (
            <div key={caseItem.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold">{caseItem.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{caseItem.description}</p>
              <div className="flex gap-2 mt-4">
              <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  sx={{ 
                    backgroundColor: '#1E2E45'
                  }}
                >
                  Edit
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="small"
                  sx={{ 
                    backgroundColor: '#1E2E45'
                  }}
                >Remove</Button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Profile content updated to match the new UI
    return (
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-5">
          <h3 className="text-xl font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField label="Full Name" fullWidth defaultValue="John Doe" InputProps={{ startAdornment: <Person /> }} />
            <TextField label="Email" fullWidth defaultValue="john.doe@legalfirm.com" InputProps={{ startAdornment: <Email /> }} />
            <TextField label="Phone" fullWidth defaultValue="(251) 911-2345" InputProps={{ startAdornment: <Phone /> }} />
            <TextField label="Location" fullWidth defaultValue="Addis Ababa, AA" InputProps={{ startAdornment: <LocationOn /> }} />
          </div>
          <TextField
            label="Biography"
            fullWidth
            multiline
            defaultValue="Corporate attorney with over 15 years of experience specializing in mergers and acquisitions, securities law, and corporate governance. Graduated from Harvard Law School and previously worked at top law firms in New York."
            rows={4}
            className="mt-10"
          />
          <Button variant="contained" color="primary" className="mt-4 w-1/3" sx={{ backgroundColor: '#1E2E45', '&:hover': { backgroundColor: '#16233B' } }}>
            Save Changes
          </Button>
        </div>

        {/* Professional Information */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-5">
          <h3 className="text-xl font-semibold">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextField label="Practice Areas" fullWidth defaultValue="Corporate Law, M&A, Securities" InputProps={{ startAdornment: <Gavel /> }} />
            <TextField label="Bar Number" fullWidth defaultValue="NY123456" InputProps={{ startAdornment: <Description /> }} />
            <TextField label="Years in Practice" fullWidth defaultValue="15" InputProps={{ startAdornment: <AccessTime /> }} />
            <TextField label="Law Firm" fullWidth defaultValue="Smith & Associates" InputProps={{ startAdornment: <Business /> }} />
          </div>
          <TextField
            label="Education"
            fullWidth
            multiline
            defaultValue="J.D., Harvard Law School, 2008 B.A., Political Science, Yale University, 2005"
            rows={2}
            className="mt-4"
          />
          <TextField
            label="Certifications & Awards"
            fullWidth
            multiline
            defaultValue="Board Certified in Corporate Law Super Lawyers Rising Star, 2015-2020 New York Bar Association Excellence Award, 2018"
            rows={2}
            className="mt-4"
          />
          <Button variant="contained" color="primary" className="mt-4 w-1/3" sx={{ backgroundColor: '#1E2E45', '&:hover': { backgroundColor: '#16233B' } }}>
            Save Changes
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar */}
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 py-14">
          <div className="text-center">
            <div className="w-30 h-30 mx-auto bg-gray-200 rounded-full mb-4">
              <img src="https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg" alt="profilepic" /> 
            </div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-gray-500">Corporate Law Specialist</p>
            <p className="text-green-600 font-medium mt-2">Approved (⭐4.2)</p>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-2 border border-gray-200 pb-14">
          <h1 className="font-bold text-2xl">Availability</h1>
          <div className="flex items-center justify-between">
            <p className="font-medium">Available for new clients</p>
            <Switch
              checked={available}
              onChange={() => setAvailable(!available)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#1E2E45',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#1E2E45',
                },
              }}
            />
          </div>
          <div className="text-sm text-gray-600">
            <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p>Saturday: 10:00 AM - 2:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        {/* Pro Bono Work */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3 border border-gray-200 pb-14">
          <h1 className="font-bold text-2xl">Pro Bono Work</h1>
          <div className="flex items-center justify-between">
            <p className="font-medium">Available for Pro Bono</p>
            <Switch 
              checked={proBono} 
              onChange={() => setProBono(!proBono)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#1E2E45',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#1E2E45',
                },
              }} 
            />
          </div>
          <p className="text-sm text-gray-600 font-bold">Pro Bono Hours</p>
          <div className='flex justify-between items-center'>
            <p className="text-sm text-gray-600">This Year:</p>
            <button style={{ backgroundColor: '#1E2E45' }} className="text-white text-xs rounded-full py-1 px-4">45 hours</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Chip label="Immigration" size="small" variant="outlined" />
            <Chip label="Family Law" size="small" variant="outlined" />
            <Chip label="Housing" size="small" variant="outlined" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Tabs */}
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-t-lg">
          <div className="grid grid-cols-2 w-full">
            <button 
              className={`font-medium px-4 py-2 rounded-t-lg ${activeTab === 'profile' ? 'bg-white border-t border-1 border-gray-200 text-gray-800' : 'text-gray-500'}`}
              onClick={() => setActiveTab('profile')}
              style={{ cursor: 'pointer' }}
            >
              Profile
            </button>
            <button 
              className={`font-medium px-4 py-2 rounded-t-lg ${activeTab === 'cases' ? 'bg-white border-t border-l border-1 border-gray-200 text-gray-800' : 'text-gray-500'}`}
              onClick={() => setActiveTab('cases')}
              style={{ cursor: 'pointer' }}
            >
              Cases
            </button>
          </div>
        </div>

        {renderMainContent()}
      </div>
    </div>
  );
}
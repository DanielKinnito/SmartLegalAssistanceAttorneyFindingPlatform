'use client'
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Search,
  ChatBubbleOutline,
  ExitToApp,
  FiberManualRecord,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Script from 'next/script';
import { logout } from "@/app/services/attorney_api";
import { fetchAttorneyProfile, updateAttorneyProfile } from "@/app/services/profile_api";

export default function AttorneyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [available, setAvailable] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    rating: 0,
    isApproved: false,
    image: null,
    expertise: [],
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const navItems = [
    { text: 'Law Search', icon: <Search className="w-5 h-5" />, path: '/common/law-search' },
    { text: 'AI Bot', icon: <ChatBubbleOutline className="w-5 h-5" />, path: '/Attorney/ai-bot' },
    { text: 'Legal Requests', path: '/Attorney/legalRequest' },
  ];

  const loadProfile = async (userId: string, token: string) => {
    try {
      const storedImage = localStorage.getItem("user_image");
      const response = await fetchAttorneyProfile(userId, token);
      if (response.attorney_data) {
        const userData = response.attorney_data.user;
        setProfileData({
          name: `${userData.first_name} ${userData.last_name}`.trim(),
          rating: response.attorney_data.rating || 0,
          isApproved: response.attorney_data.is_approved,
          image: storedImage || "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg",
        });
        setAvailable(response.attorney_data.is_available);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityChange = async () => {
    if (!userId || !accessToken) {
      setError("Missing user ID or token");
      return;
    }
    try {
      setUpdating(true);
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

  useEffect(() => {
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
      setError(error instanceof Error ? error.message : 'Failed to find token or user ID');
      setLoading(false);
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="beforeInteractive"
      />
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />

      <AppBar position="static" sx={{ backgroundColor: '#1E2E45', boxShadow: 'none' }}>
        <Toolbar className="flex justify-between px-4">
          <Link href="/" passHref>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              LegalConnect
            </Typography>
          </Link>

          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-2">
            {navItems.map((item) => (
              <Link key={item.text} href={item.path}>
                <Button
                  sx={{
                    color: pathname.startsWith(item.path) ? 'white' : 'rgba(255,255,255,0.7)',
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {item.text}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* Availability Toggle */}
            <Tooltip title={available ? "Click to set Busy" : "Click to set Available"}>
              <Box
                onClick={updating ? undefined : handleAvailabilityChange}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  px: 1.5,
                  py: 0.5,
                  cursor: 'pointer',
                  boxShadow: 1,
                  '&:hover': {
                    backgroundColor: updating ? 'white' : '#f0f0f0'
                  }
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#1E2E45',
                    fontWeight: 600,
                    mr: 1
                  }}
                >
                  {available ? "Available" : "Busy"}
                </Typography>
                <Box sx={{ position: 'relative' }}>
                  <FiberManualRecord
                    fontSize="small"
                    sx={{ color: available ? '#4CAF50' : '#9E9E9E' }}
                  />
                  {updating && (
                    <CircularProgress
                      size={16}
                      sx={{
                        color: '#1E2E45',
                        position: 'absolute',
                        top: -4,
                        left: -4,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Tooltip>

            {/* Profile Info */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleMenuOpen}>
              {profileData.image ? (
                <img
                  src={profileData.image}
                  alt="User Profile"
                  width={32}
                  height={32}
                  className="rounded-full object-cover w-8 h-8 border border-gray-400"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                  <span className="text-white">JD</span>
                </div>
              )}
              <span className="text-white text-sm">{profileData.name || "Guest"}</span>
            </div>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => {
                router.push("/Attorney/profile");
                handleMenuClose();
              }}>
                Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToApp fontSize="small" className="mr-2" /> Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {error && (
        <div className="mt-4 mx-4 text-red-700 text-xs bg-red-100 p-2 rounded-md border border-red-300">
          {error}
        </div>
      )}

      <main className="flex-grow p-4 md:p-6 bg-white">
        {loading ? <div>Loading...</div> : children}
      </main>
    </div>
  );
}

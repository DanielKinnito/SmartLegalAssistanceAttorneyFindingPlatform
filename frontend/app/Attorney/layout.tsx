'use client'
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip, 
  Typography,
  Box
} from '@mui/material';
import { 
  Search, 
  ChatBubbleOutline, 
  NotificationsNone,
  Person,
  ExitToApp,
  FiberManualRecord
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AttorneyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isAvailable, setIsAvailable] = useState(true);

  const navItems = [
    { text: 'Law Search', icon: <Search className="w-5 h-5" />, path: '/Attorney/law-search' },
    { text: 'AI Bot', icon: <ChatBubbleOutline className="w-5 h-5" />, path: '/Attorney/ai-bot' },
    { text: 'Legal Requests', path: '/Attorney/LegalRequest' },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#1E2E45',
          backgroundImage: 'none',
          boxShadow: 'none'
        }}
      >
        <Toolbar className="flex justify-between px-4">
          {/* Left - Logo */}
          <Link href="/" passHref>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                mr: 4,
                color: 'white'
              }}
            >
              LawConnect
            </Typography>
          </Link>

          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-2">
            {navItems.map((item) => (
              <Link key={item.text} href={item.path} passHref legacyBehavior>
                <Button
                  sx={{
                    color: pathname.startsWith(item.path) ? 'white' : 'rgba(255, 255, 255, 0.7)',
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

          <div className="flex items-center gap-3 border-1 border-white p-1 rounded-full">
            <IconButton sx={{ 
              color: '#1E2E45',
              backgroundColor: 'white',
              width: 27,
              height: 27,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.8)'
              }
            }}>
              <Badge badgeContent={3} color="error">
                <NotificationsNone />
              </Badge>
            </IconButton>

            <Box 
              sx={{
                display: 'flex',
                width:'110px',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '24px',
                px: 1.5,
                py: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }
              }}
              onClick={toggleAvailability}
            >
                <Typography 
                variant="body2" 
                sx={{ 
                  color: '#1E2E45',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              >
                {isAvailable ? 'Available' : 'Busy'}
              </Typography>
              <FiberManualRecord 
                fontSize="small" 
                sx={{ 
                  color: isAvailable ? '#4CAF50' : '#9E9E9E',
                  
                }} 
              />
              
            </Box>

            <Chip
                avatar={<Avatar alt="Natacha" src="https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg" />}
                label="Avatar"
                sx={{
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)'
                    }
                }}
                />

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              sx={{ mt: 1 }}
              PaperProps={{
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    backgroundColor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Avatar sx={{ width: 32, height: 32, mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Person fontSize="small" sx={{ mr: 1 }} /> My Account
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleMenuClose}>
                <ExitToApp fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <main className="flex-grow p-4 md:p-6 bg-white">
        {children}
      </main>
    </div>
  );
}
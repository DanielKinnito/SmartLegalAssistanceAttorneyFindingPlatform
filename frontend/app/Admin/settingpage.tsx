// pages/settings.tsx
import React, { useState, useEffect } from 'react';
import { adminService } from '@/app/services/admin-api';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, Save, Shield, Bell, Settings, User, Lock } from "lucide-react";

interface AdminSettings {
  name: string;
  email: string;
  notifications: {
    emailNotifications: boolean;
    newUserAlerts: boolean;
    proBonoRequests: boolean;
    systemUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
  platform: {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    maxFileSize: number;
  };
}

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    name: '',
    email: '',
    notifications: {
      emailNotifications: true,
      newUserAlerts: true,
      proBonoRequests: true,
      systemUpdates: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
    platform: {
      maintenanceMode: false,
      registrationEnabled: true,
      maxFileSize: 10,
    },
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const fetchAdminSettings = async () => {
    try {
      setLoading(true);
      const adminData = await adminService.getUserAttorney();
      const admin = adminData.find(user => adminService.isAdmin(user));
      
      if (admin) {
        setSettings(prev => ({
          ...prev,
          name: admin.User.data.first_name + ' ' + admin.User.data.last_name,
          email: admin.User.data.email,
        }));
        setImagePreview(admin.User.data.image || '');
      }
    } catch (error) {
      toast.error('Failed to load admin settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userId = (await adminService.getUserAttorney()).find(user => adminService.isAdmin(user))?.User.data.id;
      if (!userId) throw new Error('User not found');
      
      await adminService.updateUser(userId, {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      setLoading(true);
      const userId = (await adminService.getUserAttorney()).find(user => adminService.isAdmin(user))?.User.data.id;
      if (!userId) throw new Error('User not found');

      const [firstName, ...lastNameParts] = settings.name.split(' ');
      const lastName = lastNameParts.join(' ');

      // First upload the image if there's a new one
      let imageUrl = imagePreview;
      if (profileImage) {
        const formData = new FormData();
        formData.append('image', profileImage);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/uploadimage`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        imageUrl = data.image_url;
      }

      // Then update the user data with the new image URL
      await adminService.updateUser(userId, {
        first_name: firstName,
        last_name: lastName,
        image: imageUrl
      });

      toast.success('Settings updated successfully');
      setProfileImage(null); // Reset the profile image state after successful update
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#263A56]" />
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold text-[#263A56]">Admin Settings</h2>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>
      
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#263A56] data-[state=active]:text-white rounded-lg">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#263A56] data-[state=active]:text-white rounded-lg">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-[#263A56] data-[state=active]:text-white rounded-lg">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="platform" className="data-[state=active]:bg-[#263A56] data-[state=active]:text-white rounded-lg">
              <Settings className="h-4 w-4 mr-2" />
              Platform
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-white rounded-t-xl border-b border-gray-100">
                <CardTitle className="text-xl font-semibold text-[#263A56]">Profile Settings</CardTitle>
                <CardDescription>Update your profile information and avatar</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={imagePreview || '/default-avatar.png'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#263A56] text-white p-2 rounded-full cursor-pointer shadow-lg transform transition-transform hover:scale-110">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSettingsUpdate}
                    className="bg-[#263A56] hover:bg-[#263A56]/90 text-white px-6"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-white rounded-t-xl border-b border-gray-100">
                <CardTitle className="text-xl font-semibold text-[#263A56]">Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-[#263A56] hover:bg-[#263A56]/90 text-white px-6">
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </form>

                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="twoFactor" className="text-sm font-medium text-gray-700">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactorAuth: checked }
                        }))
                      }
                      className="data-[state=checked]:bg-[#263A56]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700">Session Timeout</Label>
                      <p className="text-sm text-gray-500 mt-1">Set how long you can stay inactive before being logged out</p>
                    </div>
                    <div className="w-32">
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => 
                          setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                          }))
                        }
                        className="text-right"
                      />
                      <span className="text-sm text-gray-500 mt-1 block text-right">minutes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-white rounded-t-xl border-b border-gray-100">
                <CardTitle className="text-xl font-semibold text-[#263A56]">Notification Settings</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      id: 'emailNotifications',
                      label: 'Email Notifications',
                      description: 'Receive notifications via email',
                      checked: settings.notifications.emailNotifications
                    },
                    {
                      id: 'newUserAlerts',
                      label: 'New User Alerts',
                      description: 'Get notified when new users register',
                      checked: settings.notifications.newUserAlerts
                    },
                    {
                      id: 'proBonoRequests',
                      label: 'Pro Bono Request Alerts',
                      description: 'Receive notifications for new pro bono requests',
                      checked: settings.notifications.proBonoRequests
                    },
                    {
                      id: 'systemUpdates',
                      label: 'System Update Notifications',
                      description: 'Stay informed about system updates and maintenance',
                      checked: settings.notifications.systemUpdates
                    }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor={item.id} className="text-sm font-medium text-gray-700">{item.label}</Label>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                      <Switch
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [item.id]: checked }
                          }))
                        }
                        className="data-[state=checked]:bg-[#263A56]"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-white rounded-t-xl border-b border-gray-100">
                <CardTitle className="text-xl font-semibold text-[#263A56]">Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500 mt-1">Enable maintenance mode to restrict access to the platform</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.platform.maintenanceMode}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          platform: { ...prev.platform, maintenanceMode: checked }
                        }))
                      }
                      className="data-[state=checked]:bg-[#263A56]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="registrationEnabled" className="text-sm font-medium text-gray-700">User Registration</Label>
                      <p className="text-sm text-gray-500 mt-1">Allow new users to register on the platform</p>
                    </div>
                    <Switch
                      id="registrationEnabled"
                      checked={settings.platform.registrationEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          platform: { ...prev.platform, registrationEnabled: checked }
                        }))
                      }
                      className="data-[state=checked]:bg-[#263A56]"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label htmlFor="maxFileSize" className="text-sm font-medium text-gray-700">Maximum File Upload Size</Label>
                    <p className="text-sm text-gray-500 mt-1">Set the maximum allowed file size for uploads</p>
                    <div className="mt-4 flex items-center space-x-4">
                      <Input
                        id="maxFileSize"
                        type="number"
                        value={settings.platform.maxFileSize}
                        onChange={(e) => 
                          setSettings(prev => ({
                            ...prev,
                            platform: { ...prev.platform, maxFileSize: parseInt(e.target.value) }
                          }))
                        }
                        className="w-32"
                      />
                      <span className="text-sm text-gray-500">MB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;

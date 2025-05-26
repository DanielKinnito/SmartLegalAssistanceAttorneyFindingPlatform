"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { adminService } from "@/app/services/admin-api"
import { toast } from "sonner"

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  is_attorney_approved?: boolean;
}

interface UserFormProps {
  user?: {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    is_attorney_approved?: boolean
  }
  mode?: "create" | "edit"
  onSuccess?: (user: User) => void
  onCancel?: () => void
}

interface FormData {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
  role?: string
  is_attorney_approved?: boolean
}

export function UserForm({ user, mode = "create", onSuccess, onCancel }: UserFormProps = {}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    password: "",
    confirm_password: "",
    role: user?.role || "client",
    is_attorney_approved: user?.is_attorney_approved || false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleAttorneyApprovalChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_attorney_approved: checked }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required"
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (mode === "create") {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }

      if (!formData.confirm_password) {
        newErrors.confirm_password = "Please confirm your password"
      } else if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      if (mode === "create") {
        // Create new user
        const userData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
          role: formData.role,
          is_attorney_approved: formData.role === "attorney" ? formData.is_attorney_approved : undefined
        }

        const newUser = await adminService.createAdmin(userData)
        toast.success("User created successfully")
        onSuccess?.(newUser)
      } else if (user?.id) {
        // Update existing user
        const updateData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          role: formData.role,
          is_attorney_approved: formData.role === "attorney" ? formData.is_attorney_approved : undefined
        }

        const updatedUser = await adminService.updateUser(user.id, updateData)
        toast.success("User updated successfully")
        onSuccess?.(updatedUser)
      }

      if (!onSuccess) {
        router.push("/Admin/users")
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          toast.error("Please log in to continue")
          router.push('/login')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error(mode === "create" ? "Failed to create user" : "Failed to update user")
      }
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-[#263A56]">
              {mode === "create" ? "Create New User" : "Edit User"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === "create" ? "Fill in the details to create a new user." : "Update the user's information."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="first_name" className="text-sm font-medium text-[#263A56]">First Name</Label>
                <Input 
                  id="first_name" 
                  name="first_name" 
                  value={formData.first_name} 
                  onChange={handleChange}
                  className="h-8 border-gray-200 focus:border-[#263A56] focus:ring-[#263A56]"
                  disabled={loading}
                />
                {errors.first_name && <p className="text-xs text-red-500">{errors.first_name}</p>}
        </div>

              <div className="space-y-1">
                <Label htmlFor="last_name" className="text-sm font-medium text-[#263A56]">Last Name</Label>
                <Input 
                  id="last_name" 
                  name="last_name" 
                  value={formData.last_name} 
                  onChange={handleChange}
                  className="h-8 border-gray-200 focus:border-[#263A56] focus:ring-[#263A56]"
                  disabled={loading}
                />
                {errors.last_name && <p className="text-xs text-red-500">{errors.last_name}</p>}
        </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium text-[#263A56]">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="h-8 border-gray-200 focus:border-[#263A56] focus:ring-[#263A56]"
                  disabled={loading}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

              <div className="space-y-1">
                <Label htmlFor="role" className="text-sm font-medium text-[#263A56]">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                  disabled={loading}
                >
                  <SelectTrigger id="role" className="h-8 border-gray-200 focus:border-[#263A56] focus:ring-[#263A56]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="attorney">Attorney</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === "create" && (
          <>
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-sm font-medium text-[#263A56]">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      value={formData.password} 
                      onChange={handleChange}
                      className="h-8 border-gray-200 focus:border-[#263A56] focus:ring-[#263A56]"
                      disabled={loading}
                    />
                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

                  <div className="space-y-1">
                    <Label htmlFor="confirm_password" className="text-sm font-medium text-[#263A56]">Confirm Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                      className="h-8 border-gray-200 focus:border-[#263A56] focus:ring-[#263A56]"
                      disabled={loading}
              />
                    {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password}</p>}
            </div>
          </>
        )}
      </div>

      {formData.role === "attorney" && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <Switch
            id="attorney-approval"
            checked={formData.is_attorney_approved}
            onCheckedChange={handleAttorneyApprovalChange}
                  className="data-[state=checked]:bg-[#263A56]"
                  disabled={loading}
          />
                <Label htmlFor="attorney-approval" className="text-sm font-medium text-[#263A56]">Attorney Approved</Label>
        </div>
      )}

            <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel || (() => router.push("/Admin/users"))}
                className="h-8 border-gray-200 hover:bg-[#263A56]/10 hover:text-[#263A56] hover:border-[#263A56]"
                disabled={loading}
              >
          Cancel
        </Button>
              <Button 
                type="submit"
                className="h-8 bg-[#263A56] hover:bg-[#263A56]/90 text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </div>
                ) : (
                  mode === "create" ? "Create User" : "Update User"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

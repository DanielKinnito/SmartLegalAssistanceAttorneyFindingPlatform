interface AttorneyProfileResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  attorney_data: {
    id: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      image: string | null;
      created_at: string;
      updated_at: string;
    };
    starting_price: number | null;
    is_available: boolean;
    offers_probono: boolean;
    address: string;
    rating: number;
    profile_completion: number;
    license_document: string;
    is_approved: boolean;
    expertise: string[];
  };
}

interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  address?: string;
  is_available?: boolean;
  offers_probono?: boolean;
  expertise?: string[];
}

export const fetchAttorneyProfile = async (userId: string, token: string): Promise<AttorneyProfileResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  console.log(`Fetching attorney profile for userId: ${userId} from ${baseUrl}/api/getuserbyid/${userId}`);

  const response = await fetch(`${baseUrl}/api/getuserbyid/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  console.log("Fetch attorney profile response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Fetch attorney profile response body:", errorText);
    throw new Error(`Failed to fetch attorney profile: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const updateAttorneyProfile = async (
  userId: string,
  token: string,
  data: UpdateProfileData
): Promise<AttorneyProfileResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  console.log(`Updating attorney profile for userId: ${userId}`);

  const response = await fetch(`${baseUrl}/api/getuserbyid/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("Update profile response body:", errorText);
    throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const fetchAttorneyDetails = async (userId: string, token: string): Promise<AttorneyProfileResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  console.log(`Fetching attorney details for userId: ${userId} from ${baseUrl}/api/getuserbyid/${userId}`);

  const response = await fetch(`${baseUrl}/api/getuserbyid/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  console.log("Fetch attorney details response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Fetch attorney details response body:", errorText);
    throw new Error(`Failed to fetch attorney details: ${response.status} - ${errorText}`);
  }

  return response.json();
};

interface EducationInput {
  institution: string;
  degree: string;
  year: string | number;
}

interface ExperienceInput {
  organization: string;
  title: string;
  years: string | number;
}

interface CreateEducationExperienceBody {
  education?: EducationInput;
  experience?: ExperienceInput;
}

interface CreateEducationExperienceResponse {
  success: boolean;
  message: string;
  data: any;
  error: any[];
  statuscode: number;
}

export const createEducationAndExperience = async (
  body: CreateEducationExperienceBody,
  token: string
): Promise<CreateEducationExperienceResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}api/attorney/educationandexperience`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create education/experience: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const uploadProfileImage = async (
  userId: string,
  token: string,
  imageFile: File
): Promise<AttorneyProfileResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  console.log(`Uploading profile image for userId: ${userId}`);

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${baseUrl}/api/user/uploadimage`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("Upload image response body:", errorText);
    throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
  }

  return response.json();
};
interface ClientUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: "client";
  wantsProBono: boolean;
  document?: File | null;
}


interface VerifyOtpData {
  email: string;
  otp: string;
}

export const createClientUser = async (
  userData: ClientUserData
): Promise<void> => {
  const formData = new FormData();
  formData.append("first_name", userData.first_name);
  formData.append("last_name", userData.last_name);
  formData.append("email", userData.email);
  formData.append("password", userData.password);
  formData.append("confirm_password", userData.confirm_password);
  formData.append("role", userData.role);
  formData.append("wantsProBono", String(userData.wantsProBono));
  if (userData.document) {
    formData.append("document", userData.document);
  }

  const response = await fetch(
    "https://main-backend-aan1.onrender.com/api/createuser",
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Registration failed. Please try again.");
  }
};

export const verifyOtp = async (otpData: VerifyOtpData): Promise<void> => {
  const response = await fetch(
    "https://main-backend-aan1.onrender.com/api/verifyotp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(otpData),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "OTP verification failed. Please try again."
    );
  }
};

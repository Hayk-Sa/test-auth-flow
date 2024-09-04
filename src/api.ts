import { toast } from "sonner";
import { z } from "zod";

// Update schemas to include verificationStatus and verificationCode
const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  password: z.string(),
  verificationStatus: z.boolean(),
  verificationCode: z.string(),
  resetCode: z.string().optional(),
});

const teacherSchema = userSchema.extend({
  region: z.string(),
  city: z.string(),
  school: z.string(),
  grade: z.string(),
});

const donorSchema = userSchema.extend({
  country: z.string(),
  region: z.string(),
  city: z.string(),
});

type Teacher = z.infer<typeof teacherSchema>;
type Donor = z.infer<typeof donorSchema>;

// Helper function to generate a 4-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Updated signUpTeacher function
export const signUpTeacher = async (
  teacherData: Omit<Teacher, "verificationStatus" | "verificationCode">
): Promise<{
  success: boolean;
  message: string;
  redirectTo?: string;
  role?: "teacher" | "donor";
}> => {
  try {
    // Generate verification code and set verification status
    const verificationCode = generateVerificationCode();
    const fullTeacherData: Teacher = {
      ...teacherData,
      verificationStatus: false,
      verificationCode,
    };

    // Validate the input data
    teacherSchema.parse(fullTeacherData);

    // Simulate a delay to mimic network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the email is already in use
    const existingTeachers = JSON.parse(
      localStorage.getItem("teachers") || "[]"
    );
    if (
      existingTeachers.some(
        (teacher: Teacher) => teacher.email === fullTeacherData.email
      )
    ) {
      return { success: false, message: "Email already in use" };
    }

    toast.success(
      `Teacher signed up successfully. Please verify your account. Redirecting to verification page... Your verification code is ${verificationCode}`,
      {
        duration: 10000,
        closeButton: true,
      }
    );
    // Add the new teacher to the "database"
    existingTeachers.push(fullTeacherData);
    localStorage.setItem("teachers", JSON.stringify(existingTeachers));

    return {
      success: true,
      message: "Teacher signed up successfully. Please verify your account.",
      redirectTo: "/verify-account",
      role: "teacher",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Invalid input data" };
    }
    return { success: false, message: "An error occurred during sign-up" };
  }
};

// Updated signUpDonor function
export const signUpDonor = async (
  donorData: Omit<Donor, "verificationStatus" | "verificationCode">
): Promise<{
  success: boolean;
  message: string;
  redirectTo?: string;
  role?: "teacher" | "donor";
}> => {
  try {
    // Generate verification code and set verification status
    const verificationCode = generateVerificationCode();
    const fullDonorData: Donor = {
      ...donorData,
      verificationStatus: false,
      verificationCode,
    };

    // Validate the input data
    donorSchema.parse(fullDonorData);

    // Simulate a delay to mimic network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the email is already in use
    const existingDonors = JSON.parse(localStorage.getItem("donors") || "[]");
    if (
      existingDonors.some((donor: Donor) => donor.email === fullDonorData.email)
    ) {
      return { success: false, message: "Email already in use" };
    }

    toast.success(
      `Donor signed up successfully. Please verify your account. Redirecting to verification page... Your verification code is ${verificationCode}`,
      {
        duration: 10000,
        closeButton: true,
      }
    );

    // Add the new donor to the "database"
    existingDonors.push(fullDonorData);
    localStorage.setItem("donors", JSON.stringify(existingDonors));

    return {
      success: true,
      message: "Donor signed up successfully. Please verify your account.",
      redirectTo: "/verify-account",
      role: "donor",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Invalid input data" };
    }
    return { success: false, message: "An error occurred during sign-up" };
  }
};

// New function to verify user account
export const verifyAccount = async (
  email: string,
  role: "teacher" | "donor",
  verificationCode: string
): Promise<{ success: boolean; message: string; redirectTo?: string }> => {
  const storageKey = role === "teacher" ? "teachers" : "donors";
  const users = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const userIndex = users.findIndex(
    (user: Teacher | Donor) => user.email === email
  );

  if (userIndex === -1) {
    return { success: false, message: "User not found" };
  }

  if (users[userIndex].verificationCode !== verificationCode) {
    return { success: false, message: "Invalid verification code" };
  }

  users[userIndex].verificationStatus = true;
  users[userIndex].verificationCode = null;
  localStorage.setItem(storageKey, JSON.stringify(users));

  return {
    success: true,
    message: "Account verified successfully",
    redirectTo: "/sign-in",
  };
};

// New function to sign in
export const signIn = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  role?: "teacher" | "donor";
  verificationCode?: string;
}> => {
  try {
    // Simulate a delay to mimic network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check teachers
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
    const teacher = teachers.find(
      (t: Teacher) => t.email === email && t.password === password
    );
    if (teacher) {
      if (!teacher.verificationStatus) {
        return {
          success: false,
          message: "Please verify your account",
          role: "teacher",
          verificationCode: teacher.verificationCode,
        };
      }
      return {
        success: true,
        message: "Teacher signed in successfully",
        role: "teacher",
      };
    }

    // Check donors
    const donors = JSON.parse(localStorage.getItem("donors") || "[]");
    const donor = donors.find(
      (d: Donor) => d.email === email && d.password === password
    );
    if (donor) {
      if (!donor.verificationStatus) {
        return {
          success: false,
          message: "Please verify your account",
          role: "donor",
          verificationCode: donor.verificationCode,
        };
      }
      return {
        success: true,
        message: "Donor signed in successfully",
        role: "donor",
      };
    }

    return { success: false, message: "Invalid email or password" };
  } catch (error) {
    console.error("An error occurred during sign-in:", error);
    return { success: false, message: "An error occurred during sign-in" };
  }
};

// Add these functions at the end of the file

export const requestPasswordReset = async (
  email: string
): Promise<{
  success: boolean;
  message: string;
  verificationCode?: string;
}> => {
  try {
    const teachers: Teacher[] = JSON.parse(
      localStorage.getItem("teachers") || "[]"
    );
    const donors: Donor[] = JSON.parse(localStorage.getItem("donors") || "[]");

    // Simulate a delay to mimic network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = [...teachers, ...donors].find((u) => u.email === email);

    if (!user) {
      return { success: false, message: "Email not found" };
    }

    const verificationCode = generateVerificationCode();
    user.resetCode = verificationCode;

    if (teachers.find((t) => t.email === email)) {
      localStorage.setItem("teachers", JSON.stringify(teachers));
    } else {
      localStorage.setItem("donors", JSON.stringify(donors));
    }

    return {
      success: true,
      message: `To reset your password, please use this code: ${verificationCode}`,
    };
  } catch (error) {
    console.error("An error occurred during password reset request:", error);
    return {
      success: false,
      message: "An error occurred during password reset request",
    };
  }
};

export const resetPassword = async (
  email: string,
  verificationCode: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const teachers: Teacher[] = JSON.parse(
      localStorage.getItem("teachers") || "[]"
    );
    const donors: Donor[] = JSON.parse(localStorage.getItem("donors") || "[]");

    // Simulate a delay to mimic network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let user =
      teachers.find((t) => t.email === email) ||
      donors.find((d) => d.email === email);

    if (!user || user.resetCode !== verificationCode) {
      return { success: false, message: "Invalid email or verification code" };
    }

    user.password = newPassword;
    delete user.resetCode;

    if (teachers.find((t) => t.email === email)) {
      localStorage.setItem("teachers", JSON.stringify(teachers));
    } else {
      localStorage.setItem("donors", JSON.stringify(donors));
    }

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error("An error occurred during password reset:", error);
    return {
      success: false,
      message: "An error occurred during password reset",
    };
  }
};

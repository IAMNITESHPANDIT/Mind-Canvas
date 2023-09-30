// auth.js

import { LOGIN_USER } from "@utils/endPoint";

// Function to simulate login functionality
export const login = async (email, password) => {
  try {
    // Simulate API call to authentica te user
    const response = await fetch(LOGIN_USER, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.ok) {
      return {
        success: data.success,
        token: data.token,
        role: data.role,
        userId: data.user._id,
      };
    } else {
      return { success: false, token: null };
    }
  } catch (error) {
    console.error("Failed to login:", error);
    return { success: false, token: null };
  }
};

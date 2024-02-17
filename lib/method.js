import { LOGIN_USER } from "@utils/endPoint";
import { networkCall } from "@utils/network";

export const login = async (email, password) => {
  try {
    const response = await networkCall(LOGIN_USER, {
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

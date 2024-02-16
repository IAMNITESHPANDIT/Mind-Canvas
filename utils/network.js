import { getSession } from "next-auth/react";

export const networkCall = async (url, options) => {
  try {
    const session = await getSession();
    if (session && session.user && session.user.accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${session.user.accessToken}`,
      };
    }
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error occurred");
    } else if (error instanceof Error && error.message === "JWT token expired") {
      console.error("Token expired. Logging out...");
    } else {
      console.error("Fetch error:", error);
    }
    throw error;
  }
};

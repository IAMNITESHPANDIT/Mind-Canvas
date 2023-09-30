"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";
function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");

    if (!token && !router.pathname.startsWith("/Login")) {
      router.push("/Login");
    } else if (token && router.pathname.startsWith("/Login")) {
      router.push("/Dashboard");
    }
  }, []);

  return <div>{children}</div>;
}

export default Layout;

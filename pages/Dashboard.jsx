"use client";
import Posts from "@pages/Posts";
import { useSession } from "next-auth/react";
import Link from "next/link";
import "tailwindcss/tailwind.css";

function Dashboard() {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user ? (
        <Posts />
      ) : (
        <>
          <h2>Please Sign in </h2>

          <Link href="/Signup" legacyBehavior>
            <a>Signup</a>
          </Link>
        </>
      )}
    </div>
  );
}

export default Dashboard;

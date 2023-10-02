"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import "../styles/navbar.style.scss";

const Navbar = () => {
  const session = useSession();
  const userData = session?.data;

  return (
    <div className="bg-gray-800 p-3 navBar">
      <div className="container">
        <div className="">
          <div className=" flex space-x-1 justify-end">
            {userData?.user ? (
              <>
                <p className="text-white py-2 px-4 font-bold">
                  {userData.user.name}
                </p>
                <button
                  className="bg-white-800 text-white font-bold py-1 px-4 rounded-full signBtn"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-white-800 text-white font-bold py-1 px-4 rounded-full signBtn"
                  onClick={() => signIn()}
                >
                  Sign In
                </button>
                <Link href="/Signup" legacyBehavior>
                  <button className="bg-white-800 text-white font-bold py-1 px-4 rounded-full signBtn">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

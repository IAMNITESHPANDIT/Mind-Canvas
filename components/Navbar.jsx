"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-gray-800 p-3">
      <div className="container">
        <div className="">
          <div className=" flex space-x-1 justify-end">
            {session?.user ? (
              <>
                <p className="text-white py-2 px-4 font-bold">
                  {session.user.name}
                </p>
                <button
                  className="bg-white-800 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                className="bg-white-800 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => signIn()}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

"use client";
import React, { useState } from "react";
import PostLayout from "@pages/PostLayout";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Footer from "@components/Footer";
import Button from "@components/button/Button";
import "../styles/routes.style.scss";
import PostForm from "@components/Model/PostForm";
function Routes() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="routes continer">
      {session?.user ? (
        <>
          <div className="routeBtnContainer">
            <Button btnEvent={() => setOpen(true)} btnName="Create Post" />
          </div>

          <PostLayout />
        </>
      ) : (
        <>
          <h2>Please Sign in </h2>

          <Link href="/Signup" legacyBehavior>
            <a>Signup</a>
          </Link>
        </>
      )}
      <Footer />
      {open && <PostForm open={open} setOpen={setOpen} />}
    </div>
  );
}

export default Routes;

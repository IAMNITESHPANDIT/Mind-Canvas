"use client";
import React from "react";
import PostLayout from "@pages/PostLayout";
import Footer from "@components/Footer";
import "../styles/routes.style.scss";
function Routes() {
  return (
    <div className="routes continer">
      <PostLayout />
      <Footer />
    </div>
  );
}

export default Routes;
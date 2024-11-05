import React from "react";
import Comments from "@/components/Comments";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment | Detrator",
  description: "Generated by create next app",
};

const CommentsPage = () => {

  return (
    <>
    <Comments/>
    </>
  );
};

export default CommentsPage;

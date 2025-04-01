"use client";
import Image from "next/image";
import Uploader from "./components/uploader";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";
import TutorialLink from "@/app/upload/components/tutorial-link";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const jumpToTutorial = () => {
    router.push("/tutorial");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://httpbin.org/get");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <main className="flex flex-col bg--white p-8 h-screen">
        <div className="border border-gray-300 shadow-md rounded-lg p-6 flex flex-col flex-grow">
          <h2 className="text-3xl font-bold text-left">
            Show the effect of assertions
          </h2>
          <p className="text-gray-500 text-left">
            Evaluate any audit result that is formatted as a JSON file.
          </p>
          <Uploader className="flex flex-col flex-grow text-left p-4" />
          <TermsAndPrivacy />
        </div>
        <TutorialLink linkText="here" linkHref="/tutorial" />
      </main>
    </div>
  );
};

export default Dashboard;

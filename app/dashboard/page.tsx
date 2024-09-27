"use client";

import React from "react";
import Image from "next/image";
import Uploader from "./components/uploader";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex flex-col bg-gray-100 p-8 h-screen">
        <div className="flex items-center mb-6">
          <Image src="/Logo.png" alt="Logo" width={80} height={80} />
          <h1 className="text-3xl font-bold">AuditVisualiser</h1>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col flex-grow">
          <h2 className="text-3xl font-bold text-left">
            Show the effect of assertions
          </h2>
          <p className="text-gray-500 text-left">
            Evaluate any audit result that is formatted as a JSON file.
          </p>
          <Uploader className="flex flex-col flex-grow text-left p-4" />
          <p className="bg-white text-gray-400 text-center">
            By sharing your files or using our service, you agree to our&nbsp;
            <span className="underline hover:text-gray-800">
              Terms of Service
            </span>
            &nbsp;and&nbsp;
            <span className="underline hover:text-gray-800">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

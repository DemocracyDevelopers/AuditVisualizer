"use client";

import React from "react";
import SampleSelector from "./components/SampleSelector";
import Uploader from "@/app/dashboard/components/uploader";

const Sample = () => {
  return (
    <div className="flex flex-col h-screen bg-white ">
      {/* Main content */}
      <main className="flex flex-col flex-grow p-8">
        <div className=" mb-4">
          <h2 className="text-3xl font-bold mb-2">
            Show the effect of assertions
          </h2>
          <p className="text-gray-600">
            Evaluate any audit result that is formatted as a JSON file.
          </p>
        </div>
        <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6 flex flex-col flex-grow">
          <SampleSelector />
        </div>
        <div className="mt-8">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          By sharing your files or using our service, you agree to our{" "}
          <a href="#" className="text-blue-500">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500">
            Privacy Policy
          </a>
          .
        </p>
      </main>
    </div>
  );
};

export default Sample;

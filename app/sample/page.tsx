"use client";

import React from "react";
import SampleSelector from "./components/sample-selector";
import { useRouter } from "next/navigation";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";
import TutorialLink from "@/app/upload/components/tutorial-link";

const Sample = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen ">
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
        <div className="border border-gray-300 shadow-md rounded-lg p-6 flex flex-col flex-grow">
          <SampleSelector />
          <TermsAndPrivacy />
        </div>
        <div className="mt-8">
          <button
            className="text-black-500 hover:underline"
            onClick={() => router.back()}
          >
            ← Back
          </button>
        </div>
        <TutorialLink linkText="here" linkHref="/tutorial" />
      </main>
    </div>
  );
};

export default Sample;

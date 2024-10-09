// components/TutorialContent.tsx

import React from "react";
import Link from "next/link";

const TutorialContent: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* Main content */}
      <div className="bg-white p-12 shadow-lg w-full h-full">
        {/* Main Heading - Centered */}
        <h2 className="text-5xl font-bold mb-8 text-center">Getting Started</h2>

        {/* Section: Welcome */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Welcome</h3>
          <p className="text-lg text-gray-700">
            Welcome to the Audit Visualiser! By the time you&apos;ve completed
            this tutorial, you&apos;ll be at least somewhat comfortable with the
            fundamental principles of the AuditVisualiser and how to go about
            using it.
          </p>
        </div>

        {/* Section: What’s Here */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">What’s Here</h3>
          <p className="text-lg text-gray-700">
            This document is designed to be an extremely gentle introduction, so
            we included a fair amount of material that may already be very
            familiar to you. To keep things simple, we also left out some
            information intermediate and advanced users will probably want.
          </p>
        </div>

        {/* Section: Ready */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Ready?</h3>
          <p className="text-lg text-gray-700">Let’s go!</p>
        </div>

        {/* Navigation Links - Right-aligned */}
        <div className="flex flex-col items-end mt-8 space-y-2 text-right">
          <div>
            <span className="font-bold">Next:</span>{" "}
            <Link
              href="/tutorial/introduction"
              className="text-lg text-blue-500 hover:underline"
            >
              Introduction: IRV RLAs with RAIRE
            </Link>
          </div>
          <div>
            <span className="font-bold">or:</span>{" "}
            <Link
              href="/upload"
              className="text-lg text-blue-500 hover:underline"
            >
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialContent;

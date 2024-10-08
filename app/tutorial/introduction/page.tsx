// tutorial/introduction/page.tsx

import React from "react";
import IntroductionContent from "../components/IntroductionContent"; // Adjust the import path as needed
import FloatingMenu from "../components/FloatingMenu"; // Import the FloatingMenu component

const IntroductionPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main content */}
      <main className="flex flex-col flex-grow">
        {/* Introduction Content Component */}
        <IntroductionContent />

        {/* Floating Menu */}
        <FloatingMenu />

        {/* Footer Section */}
        <p className="text-sm text-gray-500 text-center mt-8">
          By sharing your files or using our service, you agree to our{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </main>
    </div>
  );
};

export default IntroductionPage;

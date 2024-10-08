// tutorial/using-assertions-to-audit/page.tsx

import React from "react";
import UsingAssertionsContent from "../components/UsingAssertionsContent"; // Adjust the import path if needed
import FloatingMenu from "../components/FloatingMenu"; // Import FloatingMenu component

const UsingAssertionsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main content */}
      <main className="flex flex-col flex-grow">
        {/* Using Assertions Content Component */}
        <UsingAssertionsContent />

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

export default UsingAssertionsPage;

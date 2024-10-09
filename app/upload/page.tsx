"use client";
import Image from "next/image";
import Uploader from "./components/uploader";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

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
        <div className="text-center text-lg text-gray-600 my-4">
          Need help? Click{" "}
          <button
            onClick={jumpToTutorial}
            className="text-blue-600 hover:underline"
          >
            here
          </button>{" "}
          for a tutorial.
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

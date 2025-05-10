"use client";
import Uploader from "./components/uploader";
import TermsAndPrivacy from "@/app/upload/components/terms-and-privacy";
import TutorialLink from "@/app/upload/components/tutorial-link";
import { FC } from "react";

const Dashboard: FC = () => {
  return (
    <div className="flex flex-col px-8">
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
    </div>
  );
};

export default Dashboard;

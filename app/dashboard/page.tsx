"use client";
import React from "react";
import Card from "./components/card";
import AssertionTable from "./components/assertionTable";
import { FaUserFriends, FaTrophy, FaList } from "react-icons/fa"; // Example icons
import { Button } from "@/components/ui/button";
import Link from "next/link";

const assertionsData = [
  { index: 1, content: "Chuan NEB Diego", type: "NEB", color: "orange" },
];
const Dashboard = () => {
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4 mt-[-20px] pr-6">
        <Link href="/upload">
          <Button size="sm">Change File</Button>
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Left Side: Cards and Elimination Tree */}
        <div className="col-span-8 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card title="Candidate" value="4" icon={<FaUserFriends />} />
            <Card title="Winner" value="Chuan" icon={<FaTrophy />} />
            <Card title="Assertion" value="5" icon={<FaList />} />
          </div>

          {/* Elimination Tree section */}
          <div className="border border-gray-300 rounded-lg p-6 h-96">
            <h3 className="text-gray-600 text-lg font-medium">
              Elimination Tree
            </h3>
            <p className="text-gray-400 text-sm">to be updated</p>
          </div>
        </div>

        <div className="border border-gray-300 col-span-4 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-600">The Assertions</h3>
            <div className="text-right">
              <Button size="sm">View Details</Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Parse from your uploaded file
          </p>
          <AssertionTable assertions={assertionsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

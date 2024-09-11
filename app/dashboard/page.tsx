"use client";

import React, { useEffect } from "react";

const Dashboard: React.FC = () => {
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
    <div className="flex h-screen">
      {/* Left Tool Bar */}
      <aside className="w-1/8 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-semibold mb-6">AuditVisualizer</h2>
        <ul className="space-y-4">
          <li className="hover:bg-gray-700 p-2 rounded">Main</li>
          <li className="hover:bg-gray-700 p-2 rounded">Func_1</li>
          <li className="hover:bg-gray-700 p-2 rounded">Func_2</li>
          <li className="hover:bg-gray-700 p-2 rounded">Setting</li>
        </ul>
      </aside>

      {/* Main Work Space */}
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p>TODO</p>
          {/* Add more Stuff here*/}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

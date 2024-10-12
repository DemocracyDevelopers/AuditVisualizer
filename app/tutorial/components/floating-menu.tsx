// "use client";
//
// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
//
// const pages = [
//   { id: 0, name: "Getting Started", path: "/tutorial" },
//   {
//     id: 1,
//     name: "Introduction: IRV RAs with RAIRE",
//     path: "/tutorial/introduction",
//   },
//   {
//     id: 2,
//     name: "IRV elections and Visualizing Outcomes",
//     path: "/tutorial/outcomes",
//   },
//   { id: 3, name: "Assertions for IRV winners", path: "/tutorial/assertion" },
//   { id: 4, name: "Risk Limiting Audits", path: "/tutorial/risk" },
//   {
//     id: 5,
//     name: "Using assertions to audit IRV outcomes",
//     path: "/tutorial/usingassertion",
//   },
// ];
//
// const FloatingMenu: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname(); //
//
//   return (
//     <div className="fixed bottom-4 left-4 z-50">
//       {/* Floating Menu Button */}
//       <button
//         className="bg-blue-500 text-white p-2 rounded-full shadow-lg"
//         onClick={() => setOpen(!open)}
//       >
//         ☰
//       </button>
//
//       {/* Floating Menu Content */}
//       {open && (
//         <div className="bg-white shadow-lg rounded-lg mt-2 p-4 w-56">
//           <h4 className="text-lg font-bold mb-2">Table of Content</h4>
//           <ul className="space-y-2">
//             {pages.map((page) => (
//               <li key={page.id}>
//                 <Link
//                   href={page.path}
//                   className={`${
//                     pathname === page.path
//                       ? "text-blue-600 font-semibold"
//                       : "text-blue-500"
//                   } hover:underline`}
//                 >
//                   {page.name}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default FloatingMenu;
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  { id: 0, name: "Getting Started", path: "/tutorial" },
  {
    id: 1,
    name: "Introduction: IRV RAs with RAIRE",
    path: "/tutorial/introduction",
  },
  {
    id: 2,
    name: "IRV elections and Visualizing Outcomes",
    path: "/tutorial/outcomes",
  },
  { id: 3, name: "Assertions for IRV winners", path: "/tutorial/assertion" },
  { id: 4, name: "Risk Limiting Audits", path: "/tutorial/risk" },
  {
    id: 5,
    name: "Using assertions to audit IRV outcomes",
    path: "/tutorial/usingassertion",
  },
];

const FloatingMenu: React.FC = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className="fixed top-16 left-0 z-50"
      style={{ height: "calc(100vh - 4rem - 4rem)" }}
    >
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg h-full w-64 transform transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 overflow-y-auto h-full">
          <h4 className="text-xl font-bold mb-4">Table of Content</h4>
          <ul className="space-y-4">
            {pages.map((page) => (
              <li key={page.id}>
                <Link
                  href={page.path}
                  className={`block ${
                    pathname === page.path
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  } hover:underline`}
                  onClick={() => setOpen(false)}
                >
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FloatingMenu;

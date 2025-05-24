"use client";
import { Button } from "@mui/material";

interface TabsProps {
  activeTab: "profile" | "cases";
  setActiveTab: (tab: "profile" | "cases") => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-2 rounded-t-lg">
      <div className="grid grid-cols-2 w-full">
        <button
          className={`font-medium px-4 py-2 rounded-t-lg ${
            activeTab === "profile"
              ? "bg-white border-t border-l border-1 border-gray-200 text-gray-800"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("profile")}
          style={{ cursor: "pointer" }}
        >
          Profile
        </button>
        <button
          className={`font-medium px-4 py-2 rounded-t-lg ${
            activeTab === "cases"
              ? "bg-white border-t border-l border-1 border-gray-200 text-gray-800"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("cases")}
          style={{ cursor: "pointer" }}
        >
          Cases
        </button>
      </div>
    </div>
  );
}
"use client";
import { Button } from "@mui/material";



export default function Tabs() {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-2 rounded-t-lg">
      <div className="grid grid-cols-1 w-full">
        <button
          className="font-medium px-4 py-2 rounded-t-lg bg-white border-t border-l border-1 border-gray-200 text-gray-800"
        >
          Profile
        </button>
      </div>
    </div>
  );
}
import React from "react";
import { POSProvider } from "../../../context/POSContext";
import Sidebar from "./Sidebar";

export default function POSLayout({ children }) {
  return (
    <POSProvider>
      <div className="flex min-h-screen w-full bg-background dark">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </POSProvider>
  );
}

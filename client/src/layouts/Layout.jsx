import React from "react";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

export default function Layout({ children, onLogout, user }) {
  return (
    <div className="min-h-screen flex bg-white text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onLogout={onLogout} user={user} />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

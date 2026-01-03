import React from "react";

export default function ValidatorDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-600 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-emerald-500">Validator Panel</div>

        <nav className="flex-1 p-4 space-y-3">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 transition">Dashboard</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-emerald-700 transition">Pending Requests</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-emerald-700 transition">Approved Records</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-emerald-700 transition">Rejected Records</button>
        </nav>

        <div className="p-4 border-t border-emerald-500">
          <button className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Validator Dashboard</h1>
          <span className="text-gray-600">Review & verify submissions</span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold mt-2">18</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Approved</p>
            <h2 className="text-3xl font-bold mt-2">104</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Rejected</p>
            <h2 className="text-3xl font-bold mt-2">7</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Today’s Reviews</p>
            <h2 className="text-3xl font-bold mt-2">5</h2>
          </div>
        </div>

        {/* Placeholder for table to avoid mapping errors while testing */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Pending Validation Requests will appear here.</p>
        </div>

      </main>
    </div>
  );
}

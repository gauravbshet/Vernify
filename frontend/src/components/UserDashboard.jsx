import React from "react";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-600 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-500">User Panel</div>

        <nav className="flex-1 p-4 space-y-3">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 transition">Dashboard</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-700 transition">My Profile</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-700 transition">My Courses</button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Settings</button>
        </nav>

        <div className="p-4 border-t border-indigo-500">
          <button className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome Back 👋</h1>
          <span className="text-gray-600">Have a productive day!</span>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500">Enrolled Courses</p>
            <h2 className="text-3xl font-bold mt-2">5</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500">Completed</p>
            <h2 className="text-3xl font-bold mt-2">3</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500">Pending Tasks</p>
            <h2 className="text-3xl font-bold mt-2">2</h2>
          </div>
        </div>

        {/* Recent Activity (static for now to avoid map issues) */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="p-6 font-semibold text-lg border-b">Recent Activity</div>
          <ul className="divide-y">
            <li className="p-4 flex justify-between hover:bg-gray-50">
              <span>Completed React Assignment</span>
              <span className="text-green-600 font-medium">Done</span>
            </li>
            <li className="p-4 flex justify-between hover:bg-gray-50">
              <span>Updated Profile</span>
              <span className="text-blue-600 font-medium">Updated</span>
            </li>
            <li className="p-4 flex justify-between hover:bg-gray-50">
              <span>New Course Enrolled</span>
              <span className="text-indigo-600 font-medium">New</span>
            </li>
          </ul>
        </div>

      </main>
    </div>
  );
}

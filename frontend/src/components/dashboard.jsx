import React from "react";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* Sidebar */}
            <div className="w-64 bg-blue-600 text-white p-6">
                <h1 className="text-2xl font-bold mb-8">My Dashboard</h1>
                <ul className="space-y-4">
                    <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
                        Home
                    </li>
                    <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
                        Profile
                    </li>
                    <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
                        Settings
                    </li>
                    <li className="hover:bg-blue-500 p-2 rounded cursor-pointer">
                        Logout
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Welcome Back 👋
                    </h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add New
                    </button>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500">Total Users</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-2">1,250</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500">Revenue</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-2">₹45,000</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500">Active Projects</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-2">12</p>
                    </div>

                </div>

                {/* Table */}
                <div className="mt-10 bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 text-gray-600">Name</th>
                                <th className="py-2 text-gray-600">Status</th>
                                <th className="py-2 text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="py-2">Project Alpha</td>
                                <td className="py-2 text-green-600">Completed</td>
                                <td className="py-2">12 Aug 2025</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2">Project Beta</td>
                                <td className="py-2 text-yellow-600">In Progress</td>
                                <td className="py-2">15 Aug 2025</td>
                            </tr>
                            <tr>
                                <td className="py-2">Project Gamma</td>
                                <td className="py-2 text-red-600">Pending</td>
                                <td className="py-2">18 Aug 2025</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
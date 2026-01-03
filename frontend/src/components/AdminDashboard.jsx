import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  Menu, 
  X, 
  Bell, 
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Users', icon: Users },
    { label: 'Reports', icon: FileText },
    { label: 'Settings', icon: Settings },
  ];

  const stats = [
    {
      label: 'Total Reports',
      value: '2,543',
      change: '+12.5%',
      positive: true,
      icon: FileText,
      accentColor: 'blue'
    },
    {
      label: 'System Uptime',
      value: '99.8%',
      change: '+0.2%',
      positive: true,
      icon: Activity,
      accentColor: 'emerald'
    },
    {
      label: 'Active Users',
      value: '842',
      change: '+8.1%',
      positive: true,
      icon: Users,
      accentColor: 'indigo'
    },
    {
      label: 'Error Rate',
      value: '0.02%',
      change: '-0.01%',
      positive: true,
      icon: AlertCircle,
      accentColor: 'amber'
    },
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'John Smith', time: '2 minutes ago', type: 'user' },
    { action: 'Report generated', user: 'Sarah Johnson', time: '15 minutes ago', type: 'report' },
    { action: 'Settings updated', user: 'Admin', time: '1 hour ago', type: 'settings' },
    { action: 'File uploaded', user: 'Mike Davis', time: '2 hours ago', type: 'upload' },
    { action: 'User password reset', user: 'Emma Wilson', time: '3 hours ago', type: 'user' },
  ];



  const getAccentColorClasses = (color) => {
    const colors = {
      blue: 'border-l-blue-500',
      emerald: 'border-l-emerald-500',
      indigo: 'border-l-indigo-500',
      amber: 'border-l-amber-500',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-screen">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-gray-900">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${activeTab === label
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-red-50">
            <LogOut size={18} strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-gray-900">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-900">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveTab(label);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${activeTab === label
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-red-50">
            <LogOut size={18} strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Header with Gradient */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm sticky top-0 z-30">
          <div className="px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-white/90 hover:text-white"
                >
                  <Menu size={24} strokeWidth={2} />
                </button>
                <div>
                  <h1 className="text-2xl font-semibold text-white">{activeTab}</h1>
                  <p className="text-sm text-blue-100 mt-0.5">Welcome back, Admin</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all backdrop-blur-sm border border-white/20">
                  <Search size={16} strokeWidth={2} />
                  Search
                </button>
                <button className="relative p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/20">
                  <Bell size={18} strokeWidth={2} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-600"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div 
                key={i}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 border-l-4 ${getAccentColorClasses(stat.accentColor)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <stat.icon size={20} className="text-gray-600" strokeWidth={2} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.positive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {stat.positive ? (
                      <TrendingUp size={12} strokeWidth={2.5} />
                    ) : (
                      <TrendingDown size={12} strokeWidth={2.5} />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


            {/* Recent Activity */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={18} className="text-gray-600" strokeWidth={2} />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.user}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 ml-5">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">System Performance</h2>
              <div className="space-y-5">
                {[
                  { label: 'API Response Time', value: '45ms', progress: 92, color: 'blue' },
                  { label: 'Database Queries', value: '1.2k/min', progress: 68, color: 'indigo' },
                  { label: 'Cache Hit Rate', value: '94.5%', progress: 95, color: 'emerald' },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          metric.color === 'blue' ? 'bg-blue-500' :
                          metric.color === 'indigo' ? 'bg-indigo-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${metric.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Export Data', icon: FileText },
                  { label: 'Add User', icon: Users },
                  { label: 'View Logs', icon: Activity },
                  { label: 'Settings', icon: Settings },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="flex flex-col items-center justify-center gap-3 p-5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-150 group"
                  >
                    <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors">
                      <action.icon size={20} className="text-gray-600 group-hover:text-gray-900" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
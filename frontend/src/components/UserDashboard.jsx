import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Award,
  UploadCloud,
  FileText,
  Trash2,
  Activity
} from 'lucide-react';

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'My Profile', icon: User },
    { label: 'My Courses', icon: BookOpen },
    { label: 'Settings', icon: Settings },
  ];

  const stats = [
    {
      label: 'Enrolled Courses',
      value: '5',
      change: '+2 this month',
      positive: true,
      icon: BookOpen,
      accentColor: 'emerald'
    },
    {
      label: 'Completed',
      value: '3',
      change: '60% completion',
      positive: true,
      icon: CheckCircle2,
      accentColor: 'teal'
    },
    {
      label: 'Pending Tasks',
      value: '2',
      change: 'Due this week',
      positive: false,
      icon: Clock,
      accentColor: 'amber'
    },
    {
      label: 'Certificates',
      value: '3',
      change: 'View all',
      positive: true,
      icon: Award,
      accentColor: 'cyan'
    },
  ];

  const recentActivity = [
    { action: 'Completed React Assignment', user: 'You', time: '2 hours ago', type: 'success' },
    { action: 'Updated Profile Information', user: 'You', time: '5 hours ago', type: 'info' },
    { action: 'Enrolled in Advanced JavaScript', user: 'You', time: '1 day ago', type: 'info' },
    { action: 'Submitted Project Milestone 2', user: 'You', time: '2 days ago', type: 'pending' },
    { action: 'Earned UI/UX Certificate', user: 'You', time: '3 days ago', type: 'success' },
  ];

  const addFiles = (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(newFiles)]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = () => {
    if (!files.length) {
      alert('Please select files to upload');
      return;
    }
    alert(`Successfully uploaded ${files.length} file(s)`);
    setFiles([]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const getAccentColorClasses = (color) => {
    const colors = {
      emerald: 'border-l-emerald-500',
      teal: 'border-l-teal-500',
      amber: 'border-l-amber-500',
      cyan: 'border-l-cyan-500',
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-screen">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <User size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-gray-900">User Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${activeTab === label
                  ? 'bg-emerald-50 text-emerald-700'
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <User size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-gray-900">User Portal</span>
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
                  ? 'bg-emerald-50 text-emerald-700'
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
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-sm sticky top-0 z-30">
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
                  <h1 className="text-2xl font-semibold text-white">Welcome Back 👋</h1>
                  <p className="text-sm text-emerald-100 mt-0.5">Have a productive day!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all backdrop-blur-sm border border-white/20">
                  <Search size={16} strokeWidth={2} />
                  Search
                </button>
                <button className="relative p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/20">
                  <Bell size={18} strokeWidth={2} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-teal-400 rounded-full border-2 border-emerald-600"></span>
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
                  {stat.positive !== undefined && (
                    <div className={`flex items-center gap-1 ${
                      stat.positive 
                        ? 'text-emerald-600' 
                        : 'text-amber-600'
                    }`}>
                      {stat.positive ? (
                        <TrendingUp size={14} strokeWidth={2.5} />
                      ) : (
                        <TrendingDown size={14} strokeWidth={2.5} />
                      )}
                    </div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 font-medium mb-2">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* File Upload Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Upload Assignments</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Drag and drop files or click to browse</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <UploadCloud className="text-emerald-600" size={20} strokeWidth={2} />
                  </div>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setDragActive(true)}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
                    ${dragActive 
                      ? 'border-emerald-400 bg-emerald-50' 
                      : 'border-gray-300 hover:border-emerald-400 bg-gray-50'}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                  />

                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 mb-4 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                      <UploadCloud className="text-emerald-600" size={24} strokeWidth={2} />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports PDF, DOC, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Selected Files ({files.length})
                      </h3>
                      <button
                        onClick={() => setFiles([])}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {files.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 bg-white rounded border border-gray-200">
                              <FileText size={16} className="text-gray-600" strokeWidth={2} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-900 truncate font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(i);
                            }}
                            className="ml-3 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={files.length === 0}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200
                      ${files.length > 0
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm hover:shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    <UploadCloud size={18} strokeWidth={2} />
                    Upload Files
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity size={18} className="text-gray-600" strokeWidth={2} />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          activity.type === 'success' ? 'bg-emerald-500' :
                          activity.type === 'pending' ? 'bg-amber-500' :
                          'bg-teal-500'
                        }`}></div>
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

          {/* Course Progress & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Course Progress</h2>
              <div className="space-y-5">
                {[
                  { course: 'React Masterclass', progress: 85, color: 'emerald' },
                  { course: 'Backend Development', progress: 60, color: 'teal' },
                  { course: 'UI/UX Design Fundamentals', progress: 40, color: 'cyan' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.course}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.color === 'emerald' ? 'bg-emerald-500' :
                          item.color === 'teal' ? 'bg-teal-500' :
                          'bg-cyan-500'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h2>
              <div className="space-y-4">
                {[
                  { label: 'Study Hours This Week', value: '12.5 hrs', icon: Clock },
                  { label: 'Assignments Submitted', value: '8/10', icon: CheckCircle2 },
                  { label: 'Current Streak', value: '5 days', icon: TrendingUp },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-gray-200">
                        <stat.icon size={18} className="text-gray-600" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
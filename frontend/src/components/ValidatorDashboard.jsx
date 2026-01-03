import React, { useState } from 'react';
import {
  LayoutDashboard,
  Clock,
  CheckCircle2,
  XCircle,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  TrendingUp,
  User,
  FileText,
  MoreVertical,
  Filter,
  ChevronDown
} from 'lucide-react';

export default function ValidatorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Pending Requests', icon: Clock },
    { label: 'Approved Records', icon: CheckCircle2 },
    { label: 'Rejected Records', icon: XCircle },
  ];

  const stats = [
    {
      label: 'Pending Requests',
      value: '24',
      change: '+5 from yesterday',
      icon: Clock,
      accentColor: 'amber',
      trend: 'up'
    },
    {
      label: 'Approved Today',
      value: '18',
      change: '+12% from yesterday',
      icon: CheckCircle2,
      accentColor: 'stone',
      trend: 'up'
    },
    {
      label: 'Rejected Today',
      value: '3',
      change: '-2 from yesterday',
      icon: XCircle,
      accentColor: 'red',
      trend: 'down'
    },
    {
      label: 'Total Reviews',
      value: '156',
      change: 'This week',
      icon: TrendingUp,
      accentColor: 'neutral',
      trend: 'neutral'
    },
  ];

  const pendingRequests = [
    {
      id: 'REQ-1001',
      user: 'Sarah Johnson',
      type: 'Account Verification',
      submitted: '2 hours ago',
      priority: 'high',
      description: 'Business account verification request'
    },
    {
      id: 'REQ-1002',
      user: 'Michael Chen',
      type: 'Document Review',
      submitted: '4 hours ago',
      priority: 'medium',
      description: 'Identity document verification'
    },
    {
      id: 'REQ-1003',
      user: 'Emma Wilson',
      type: 'Profile Update',
      submitted: '6 hours ago',
      priority: 'low',
      description: 'Profile information update request'
    },
    {
      id: 'REQ-1004',
      user: 'James Brown',
      type: 'License Verification',
      submitted: '8 hours ago',
      priority: 'high',
      description: 'Professional license verification'
    },
    {
      id: 'REQ-1005',
      user: 'Lisa Anderson',
      type: 'Address Verification',
      submitted: '1 day ago',
      priority: 'medium',
      description: 'Residential address confirmation'
    },
  ];

  const recentActivity = [
    { action: 'Approved account verification', user: 'John Smith', time: '10 minutes ago', type: 'approved' },
    { action: 'Rejected document review', user: 'Alice Cooper', time: '25 minutes ago', type: 'rejected' },
    { action: 'Approved profile update', user: 'Bob Martin', time: '1 hour ago', type: 'approved' },
    { action: 'Pending review assigned', user: 'Carol White', time: '2 hours ago', type: 'pending' },
  ];

  const handleApprove = (id) => {
    alert(`Approved request ${id}`);
  };

  const handleReject = (id) => {
    alert(`Rejected request ${id}`);
  };

  const getAccentColorClasses = (color) => {
    const colors = {
      amber: 'border-l-amber-500',
      stone: 'border-l-stone-500',
      red: 'border-l-red-500',
      neutral: 'border-l-neutral-500',
    };
    return colors[color] || colors.stone;
  };

  const getPriorityStyles = (priority) => {
    const styles = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      low: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return styles[priority] || styles.medium;
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-screen">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-600 to-neutral-700 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-gray-900">Validator Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${activeTab === label
                  ? 'bg-stone-50 text-stone-700'
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-600 to-neutral-700 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-gray-900">Validator Portal</span>
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
                  ? 'bg-stone-50 text-stone-700'
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
        {/* Top Header */}
        <header className="bg-gradient-to-r from-stone-700 to-neutral-800 shadow-sm sticky top-0 z-30">
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
                  <h1 className="text-2xl font-semibold text-white">Validator Dashboard</h1>
                  <p className="text-sm text-stone-200 mt-0.5">Review and validate pending requests</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all backdrop-blur-sm border border-white/20">
                  <Search size={16} strokeWidth={2} />
                  Search
                </button>
                <button className="relative p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/20">
                  <Bell size={18} strokeWidth={2} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full border-2 border-stone-700"></span>
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
                  {stat.trend === 'up' && (
                    <div className="flex items-center gap-1 text-stone-600">
                      <TrendingUp size={14} strokeWidth={2.5} />
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
            {/* Pending Requests Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Pending Validation Requests</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Review and take action on requests</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors border border-gray-200">
                    <Filter size={16} strokeWidth={2} />
                    Filter
                    <ChevronDown size={14} strokeWidth={2} />
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div 
                      key={request.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500">{request.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityStyles(request.priority)}`}>
                              {request.priority}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">{request.type}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <User size={12} strokeWidth={2} />
                            <span>{request.user}</span>
                            <span className="text-gray-400">•</span>
                            <span>{request.submitted}</span>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical size={16} strokeWidth={2} />
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3 pl-0">{request.description}</p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-600 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <CheckCircle2 size={14} strokeWidth={2} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <XCircle size={14} strokeWidth={2} />
                          Reject
                        </button>
                        <button className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold transition-colors">
                          <FileText size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Showing 5 of 24 requests</span>
                  <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                    Load More
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={18} className="text-gray-600" strokeWidth={2} />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          activity.type === 'approved' ? 'bg-stone-500' :
                          activity.type === 'rejected' ? 'bg-red-500' :
                          'bg-amber-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{activity.user}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 ml-5">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Approval Rate', value: '86%', progress: 86 },
                    { label: 'Avg. Review Time', value: '12 min', progress: 75 },
                    { label: 'Quality Score', value: '94%', progress: 94 },
                  ].map((metric, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-stone-500 rounded-full transition-all duration-500"
                          style={{ width: `${metric.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
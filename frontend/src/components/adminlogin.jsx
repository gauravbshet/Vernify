import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    (async () => {
      try {
        const { getToken, getDashboard } = await import('../api/auth')
        const token = getToken()
        if (!token) return
        // verify role with server before redirecting
        try {
          await getDashboard('admin')
          navigate('/admin/dashboard')
        } catch (err) {
          // token invalid or not admin; stay on login page
        }
      } catch (e) { }
    })()
  }, [])

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }
    try {
      const json = await import('../api/auth').then(mod => mod.signIn({ email, password, role: 'admin' }))
      if (!json.success) {
        alert(json.message || 'Sign in failed')
        return
      }
      // optionally verify returned role
      const returnedRole = json.data?.role
      if (returnedRole && returnedRole !== 'admin') {
        alert('Forbidden: admin role required')
        return
      }
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Sign in error', err)
      alert(err.message || 'Sign in failed')
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 border-4 border-white rounded-lg"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none text-gray-700"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none text-gray-700"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-medium shadow-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 transform hover:scale-105"
            >
              Sign In
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign up
            </button>
          </div>

          <div className="mt-4 text-center text-sm">
            <button onClick={() => navigate('/user/login')} className="text-sm text-gray-500 underline mr-4">User login</button>
            <button onClick={() => navigate('/validator')} className="text-sm text-gray-500 underline">Validator login</button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}
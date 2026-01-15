import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const { getToken, getDashboard } = await import('../api/auth')
        const token = getToken()
        if (!token) return
        try { await getDashboard('user'); navigate('/user/dashboard') } catch (e) { }
      } catch (e) { }
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Please enter email and password')
    try {
      const json = await import('../api/auth').then(mod => mod.signIn({ email, password, role: 'user' }))
      if (!json.success) return alert(json.message || 'Sign in failed')
      navigate('/user/dashboard')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Sign in failed')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <a href="#" className="text-sm text-indigo-500 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?
          <a href="#" className="text-indigo-600 font-medium ml-1 hover:underline">
            Sign up
          </a>
        </p>

        <div className="mt-4 text-center text-sm">
          <button onClick={() => navigate('/admin/login')} className="text-sm text-gray-500 underline mr-4">Admin login</button>
          <button onClick={() => navigate('/validator')} className="text-sm text-gray-500 underline">Validator login</button>
        </div>
      </div>
    </div>
  );
}

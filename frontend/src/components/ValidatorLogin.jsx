import { useState } from "react";
import { useNavigate } from 'react-router-dom'

export default function ValidatorLogin() {
  const [validatorId, setValidatorId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      validatorId,
      password,
    });
    if (validatorId && password) {
      navigate('/validator/dashboard')
    } else {
      alert('Please enter Validator ID and password')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Validator Login
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Secure access for validators
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Validator ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Validator ID
            </label>
            <input
              type="text"
              required
              value={validatorId}
              onChange={(e) => setValidatorId(e.target.value)}
              placeholder="Enter Validator ID"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              Authorized personnel only
            </span>
            <a href="#" className="text-sm text-indigo-300 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Login as Validator
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Validator Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
import React, { useState } from 'react';

const roleText = {
  admin: 'Admin',
  doctor: 'Doctor',
};

const Login = ({ onLogin, loading, selectedRole, onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.password) {
      setError('Username and password are required.');
      return;
    }

    try {
      await onLogin({
        username: formData.username.trim(),
        password: formData.password,
      });
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          ← Back to front page
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Medical Prescription System</h1>
        <p className="text-gray-600 mb-2">Login as Admin or Doctor</p>
        {selectedRole && (
          <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-3 py-2 mb-4">
            Selected portal: <span className="font-semibold">{roleText[selectedRole] || selectedRole}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={selectedRole ? `Enter ${roleText[selectedRole] || selectedRole} username` : 'admin or doctor username'}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
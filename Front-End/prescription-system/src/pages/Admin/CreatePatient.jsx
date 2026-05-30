import React, { useState } from 'react';
import Card from '../../components/Card';
import { patientAPI } from '../../utils/api';

const CreatePatient = ({ onSuccess }) => {
  const labelClass = 'inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2';

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
      };
      await patientAPI.create(patientData);
      setSuccess('Patient created successfully!');
      setFormData({
        name: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to create patient. Please try again.');
      console.error('Error creating patient:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create Patient</h1>
        <p className="text-gray-500 mt-2">Add patient profile details and contact information.</p>
      </div>

      <Card className="overflow-hidden border border-indigo-100 shadow-lg shadow-indigo-100/40">
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 bg-gradient-to-br from-white to-slate-50">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Patient Details</h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                    placeholder="John Smith"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min="0"
                      max="150"
                      className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                    placeholder="patient@email.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed bg-blue-300 p-2 rounded-xl border-blue-300 hover:bg-blue-400 hover:border-blue-400 transition"
            >
              {loading ? 'Creating...' : 'Create Patient'}
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  name: '',
                  age: '',
                  gender: '',
                  phone: '',
                  email: '',
                })
              }
               className="btn-secondary bg-gray-400 p-2 rounded-xl border-gray-400"
            >
              Clear
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePatient;

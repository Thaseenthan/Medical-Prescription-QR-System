import React, { useState } from 'react';
import Card from '../../components/Card';
import { doctorAPI } from '../../utils/api';

const CreateDoctor = ({ onSuccess }) => {
  const labelClass = 'inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2';

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    hospital: '',
    email: '',
    doctorId: '',
    password: '',
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
      const payload = {
        name: formData.name,
        specialization: formData.specialization,
        hospital: formData.hospital,
        email: formData.email,
      };

      if (formData.doctorId.trim()) {
        payload.doctorId = formData.doctorId.trim();
      }
      if (formData.password) {
        payload.password = formData.password;
      }

      await doctorAPI.create(payload);
      setSuccess('Doctor created successfully!');
      setFormData({
        name: '',
        specialization: '',
        hospital: '',
        email: '',
        doctorId: '',
        password: '',
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to create doctor. Please try again.');
      console.error('Error creating doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create Doctor</h1>
        <p className="text-gray-500 mt-2">Add doctor profile details and login credentials.</p>
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
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Doctor Details</h2>

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
                    placeholder="Dr. John Doe"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                    placeholder="Cardiologist"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Hospital *
                  </label>
                  <input
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    required
                    className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                    placeholder="City General Hospital"
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
                    className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                    placeholder="doctor@hospital.com"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Login Credentials</h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Login Username (Optional)
                  </label>
                  <input
                    type="text"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="input-field focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                    placeholder="DOC1002 or custom"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Login Password (Optional)
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                    placeholder="Set password or auto-generate"
                  />
                </div>

                <div className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2">
                  <p className="text-sm text-sky-700">
                    If username/password are blank, backend auto-generates credentials and emails them to doctor.
                  </p>
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
              {loading ? 'Creating...' : 'Create Doctor'}
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  name: '',
                  specialization: '',
                  hospital: '',
                  email: '',
                  doctorId: '',
                  password: '',
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

export default CreateDoctor;

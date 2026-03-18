import React, { useState } from 'react';
import Card from '../../components/Card';
import { doctorAPI } from '../../utils/api';

const CreateDoctor = ({ onSuccess }) => {
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
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create Doctor</h1>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Dr. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization *
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Cardiologist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital *
            </label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="City General Hospital"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="doctor@hospital.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login Username (Optional)
              </label>
              <input
                type="text"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="input-field"
                placeholder="DOC1002 or custom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login Password (Optional)
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Set password or auto-generate"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500">
            If username/password are blank, backend auto-generates credentials and emails them to doctor.
          </p>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="btn-secondary"
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

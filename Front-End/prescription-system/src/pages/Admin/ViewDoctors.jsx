import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { doctorAPI } from '../../utils/api';

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorAPI.getAll();
      setDoctors(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch doctors. Please try again.');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorAPI.delete(id);
        fetchDoctors();
      } catch (err) {
        alert('Failed to delete doctor');
        console.error('Error deleting doctor:', err);
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'hospital', label: 'Hospital' },
    { key: 'email', label: 'Email' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Doctors</h1>
        <button onClick={fetchDoctors} className="btn-secondary">
          🔄 Refresh
        </button>
      </div>

      <Card>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading doctors...</p>
          </div>
        ) : (
          <Table columns={columns} data={doctors} onDelete={handleDelete} />
        )}
      </Card>
    </div>
  );
};

export default ViewDoctors;

import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { patientAPI } from '../../utils/api';

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientAPI.getAll();
      setPatients(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch patients. Please try again.');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientAPI.delete(id);
        fetchPatients();
      } catch (err) {
        alert('Failed to delete patient');
        console.error('Error deleting patient:', err);
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Patients</h1>
        <button onClick={fetchPatients} className="btn-secondary">
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
            <p className="mt-2 text-gray-600">Loading patients...</p>
          </div>
        ) : (
          <Table columns={columns} data={patients} onDelete={handleDelete} />
        )}
      </Card>
    </div>
  );
};

export default ViewPatients;

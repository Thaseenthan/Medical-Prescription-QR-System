import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { prescriptionAPI } from '../../utils/api';

const ViewPrescriptions = ({ authUser }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const doctorId = authUser?.username || '';
      const data = await prescriptionAPI.getByDoctorId(doctorId);
      setPrescriptions(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch prescriptions. Please try again.');
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleView = (prescription) => {
    console.log('Selected Prescription:', prescription); // Debug log
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionAPI.delete(id);
        fetchPrescriptions();
      } catch (err) {
        alert('Failed to delete prescription');
        console.error('Error deleting prescription:', err);
      }
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      await prescriptionAPI.downloadPDF(id);
    } catch (err) {
      alert('Failed to download prescription PDF');
      console.error('Error downloading PDF:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const columns = [
    { 
      key: 'patient', 
      label: 'Patient',
      render: (patient) => patient?.name || 'N/A'
    },
    { 
      key: 'doctor', 
      label: 'Doctor',
      render: (doctor) => doctor?.name || 'N/A'
    },
    { key: 'diagnosis', label: 'Diagnosis' },
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (date) => formatDate(date)
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Prescriptions</h1>
        <button onClick={fetchPrescriptions} className="btn-secondary">
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
            <p className="mt-2 text-gray-600">Loading prescriptions...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={prescriptions}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {/* Prescription Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPrescription(null);
        }}
        title="Prescription Details"
      >
        {selectedPrescription ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold text-lg mb-2">Patient Information</h4>
              <div className="space-y-1">
                <p><span className="font-semibold">Name:</span> {selectedPrescription.patient?.name}</p>
                <p><span className="font-semibold">Age:</span> {selectedPrescription.patient?.age}</p>
                <p><span className="font-semibold">Gender:</span> {selectedPrescription.patient?.gender}</p>
                <p><span className="font-semibold">Email:</span> {selectedPrescription.patient?.email}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold text-lg mb-2">Doctor Information</h4>
              <div className="space-y-1">
                <p><span className="font-semibold">Name:</span> {selectedPrescription.doctor?.name}</p>
                <p><span className="font-semibold">Specialization:</span> {selectedPrescription.doctor?.specialization}</p>
                <p><span className="font-semibold">Hospital:</span> {selectedPrescription.doctor?.hospital}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">Diagnosis</h4>
              <p className="text-gray-700">{selectedPrescription.diagnosis}</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">Medicines</h4>
              {selectedPrescription.medicines && selectedPrescription.medicines.length > 0 ? (
                <div className="space-y-2">
                  {selectedPrescription.medicines.map((medicine, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded">
                      <p className="font-semibold">{medicine.name}</p>
                      <p className="text-sm text-gray-600">
                        Dosage: {medicine.dosage} | Frequency: {medicine.frequency} | Duration: {medicine.duration}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No medicines prescribed</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold text-lg mb-2">QR Code</h4>
              <div className="flex justify-center">
                <img
                  src={prescriptionAPI.getQRCode(selectedPrescription.id)}
                  alt="Prescription QR Code"
                  className="border-2 border-gray-300 rounded"
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                Scan this QR code to view prescription details
              </p>
            </div>

            <div className="text-sm text-gray-600 text-center">
              Created: {formatDate(selectedPrescription.createdAt)}
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => handleDownloadPDF(selectedPrescription.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
              >
                📥 Download as PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading prescription details...</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewPrescriptions;

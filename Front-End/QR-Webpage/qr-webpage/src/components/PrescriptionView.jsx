import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PrescriptionView = () => {
  const { id } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        const response = await axios.get(`${apiUrl}/prescriptions/${id}`);
        setPrescription(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load prescription. Please check the QR code and try again.');
        console.error('Error fetching prescription:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrescription();
    }
  }, [id]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const response = await axios.get(`${apiUrl}/prescriptions/${id}/pdf`, {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download prescription PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prescription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-yellow-500 text-5xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Prescription Found</h2>
          <p className="text-gray-600">The prescription you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Alert Banner - Download Prompt */}
        <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-6 rounded-lg shadow-md">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📋</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-800 mb-2">This is Your Prescription</h2>
              <p className="text-green-700 mb-4">You can view all the details below and download it as a PDF document.</p>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex items-center gap-2 text-lg"
              >
                <span>{downloading ? '⏳ Downloading...' : '📥 Download PDF Now'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-lg p-6 border-b-4 border-blue-600">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Prescription</h1>
            <p className="text-gray-500 text-sm">Prescription ID: {prescription.id}</p>
            <p className="text-gray-500 text-sm">Issued: {formatDate(prescription.createdAt)}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg">
          {/* Doctor Information */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">👨‍⚕️</span>
              Doctor Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-800">{prescription.doctor?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-semibold text-gray-800">{prescription.doctor?.specialization || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hospital</p>
                <p className="font-semibold text-gray-800">{prescription.doctor?.hospital || 'N/A'}</p>
              </div>
              {/* <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{prescription.doctor?.email || 'N/A'}</p>
              </div> */}
            </div>
          </div>

          {/* Patient Information */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">🧑‍🦱</span>
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-800">{prescription.patient?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-semibold text-gray-800">{prescription.patient?.age || 'N/A'} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-semibold text-gray-800">{prescription.patient?.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-semibold text-gray-800">{prescription.patient?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📝</span>
                Diagnosis
              </h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-800">{prescription.diagnosis}</p>
              </div>
            </div>
          )}

          {/* Medicines */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">💊</span>
              Prescribed Medicines
            </h2>
            {prescription.medicines && prescription.medicines.length > 0 ? (
              <div className="space-y-4">
                {prescription.medicines.map((medicine, index) => (
                  <div key={medicine.id} className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {index + 1}. {medicine.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-600">Dosage</p>
                            <p className="font-semibold text-gray-800">{medicine.dosage}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Frequency</p>
                            <p className="font-semibold text-gray-800">{medicine.frequency}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Duration</p>
                            <p className="font-semibold text-gray-800">{medicine.duration}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No medicines prescribed</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-lg shadow-lg p-4 text-center border-t">
          <p className="text-xs text-gray-500">
            This is an official medical prescription. Please consult your doctor for any queries.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Generated on {formatDate(prescription.createdAt)}
          </p>
        </div>

        {/* Print Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200"
          >
            🖨️ Print Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionView;

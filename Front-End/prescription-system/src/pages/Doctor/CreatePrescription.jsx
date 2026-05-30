import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { patientAPI, doctorAPI, prescriptionAPI } from '../../utils/api';

const CreatePrescription = ({ authUser, onSuccess }) => {
  const labelClass = 'inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2';

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    diagnosis: '',
  });
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await patientAPI.getAll();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorAPI.getAll();

      const doctorUsername = (authUser?.username || '').trim().toLowerCase();
      const matchedDoctor = data.find(
        (doctor) => (doctor.doctorId || '').toLowerCase() === doctorUsername
      );

      if (!matchedDoctor) {
        setDoctors([]);
        setFormData((prev) => ({ ...prev, doctorId: '' }));
        setError('Logged-in doctor account was not found. Please contact admin.');
        return;
      }

      setDoctors([matchedDoctor]);
      setFormData((prev) => ({ ...prev, doctorId: matchedDoctor.id }));
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctor profile.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '', frequency: '', duration: '' },
    ]);
  };

  const removeMedicine = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleClear = () => {
    setError('');
    setSuccess('');
    setFormData((prev) => ({
      ...prev,
      patientId: '',
      diagnosis: '',
    }));
    setMedicines([{ name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const selectedPatient = patients.find((p) => p.id === formData.patientId);
      const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);

      if (!selectedDoctor) {
        throw new Error('Doctor profile is required to create prescription.');
      }

      const prescriptionData = {
        patient: selectedPatient,
        doctor: selectedDoctor,
        diagnosis: formData.diagnosis,
        createdAt: new Date().toISOString(),
        medicines: medicines,
      };

      await prescriptionAPI.create(prescriptionData);
      setSuccess('Prescription created successfully! QR code sent to patient\'s email.');
      
      // Reset form
      setFormData({
        patientId: '',
        doctorId: '',
        diagnosis: '',
      });
      setMedicines([{ name: '', dosage: '', frequency: '', duration: '' }]);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to create prescription. Please try again.');
      console.error('Error creating prescription:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create Prescription</h1>
        <p className="text-gray-500 mt-2">Assign patient, verify doctor, and add medicine schedule.</p>
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
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Prescription Details</h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Select Patient *
                  </label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                    className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                  >
                    <option value="">Choose a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.age}y - {patient.gender}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Select Doctor *
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                    className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                    disabled
                  >
                    <option value="">Loading logged doctor...</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization} ({doctor.doctorId})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Doctor is fixed to currently logged-in account.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Diagnosis Notes</h2>

              <div>
                <label className={labelClass}>
                  Diagnosis *
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                  rows="7"
                  className="input-field focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
                  placeholder="Enter diagnosis details..."
                />
              </div>
            </div>
          </div>

          {/* Medicines Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Medicines</h3>
              <button
                type="button"
                onClick={addMedicine}
                className="btn-secondary text-sm"
              >
                + Add Medicine
              </button>
            </div>

            {medicines.map((medicine, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-4 relative"
              >
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(index, 'name', e.target.value)
                      }
                      required
                      className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      placeholder="e.g., Amoxicillin"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, 'dosage', e.target.value)
                      }
                      required
                      className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      placeholder="e.g., 500mg"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Frequency *
                    </label>
                    <input
                      type="text"
                      value={medicine.frequency}
                      onChange={(e) =>
                        handleMedicineChange(index, 'frequency', e.target.value)
                      }
                      required
                      className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      placeholder="e.g., 3 times a day"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) =>
                        handleMedicineChange(index, 'duration', e.target.value)
                      }
                      required
                      className="input-field focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      placeholder="e.g., 7 days"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed bg-blue-300 p-2 rounded-xl border-blue-300 hover:bg-blue-400 hover:border-blue-400 transition"
            >
              {loading ? 'Creating...' : 'Create Prescription'}
            </button>
            <button type="button" onClick={handleClear} className="btn-secondary bg-gray-400 p-2 rounded-xl border-gray-400">
              Clear
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePrescription;

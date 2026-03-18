// Debug utility to test API calls
// Open browser console (F12) and use these functions to test

import { doctorAPI, patientAPI, prescriptionAPI } from './api';

// Test functions
window.testAPI = {
  // Test getting all prescriptions
  testGetPrescriptions: async () => {
    try {
      console.log('Testing GET /api/prescriptions...');
      const data = await prescriptionAPI.getAll();
      console.log('✅ Success! Prescriptions:', data);
      return data;
    } catch (error) {
      console.error('❌ Error:', error);
      return null;
    }
  },

  // Test getting a specific prescription
  testGetPrescription: async (id) => {
    try {
      console.log(`Testing GET /api/prescriptions/${id}...`);
      const data = await prescriptionAPI.getById(id);
      console.log('✅ Success! Prescription:', data);
      return data;
    } catch (error) {
      console.error('❌ Error:', error);
      return null;
    }
  },

  // Test QR code URL
  testQRCode: (id) => {
    const url = prescriptionAPI.getQRCode(id);
    console.log('QR Code URL:', url);
    console.log('Opening in new tab...');
    window.open(url, '_blank');
  },

  // Test all doctors
  testGetDoctors: async () => {
    try {
      console.log('Testing GET /api/doctors...');
      const data = await doctorAPI.getAll();
      console.log('✅ Success! Doctors:', data);
      return data;
    } catch (error) {
      console.error('❌ Error:', error);
      return null;
    }
  },

  // Test all patients
  testGetPatients: async () => {
    try {
      console.log('Testing GET /api/patients...');
      const data = await patientAPI.getAll();
      console.log('✅ Success! Patients:', data);
      return data;
    } catch (error) {
      console.error('❌ Error:', error);
      return null;
    }
  },

  // Test create prescription
  testCreatePrescription: async () => {
    try {
      console.log('This is a test - get doctors and patients first');
      const doctors = await doctorAPI.getAll();
      const patients = await patientAPI.getAll();
      
      if (doctors.length === 0) {
        console.error('❌ No doctors found. Create a doctor first.');
        return;
      }
      if (patients.length === 0) {
        console.error('❌ No patients found. Create a patient first.');
        return;
      }

      const testPrescription = {
        patient: patients[0],
        doctor: doctors[0],
        diagnosis: 'Test diagnosis',
        createdAt: new Date().toISOString(),
        medicines: [
          {
            name: 'Test Medicine',
            dosage: '500mg',
            frequency: '2 times a day',
            duration: '5 days'
          }
        ]
      };

      console.log('Testing POST /api/prescriptions...');
      console.log('Sending:', testPrescription);
      const data = await prescriptionAPI.create(testPrescription);
      console.log('✅ Success! Created prescription:', data);
      return data;
    } catch (error) {
      console.error('❌ Error:', error);
      return null;
    }
  }
};

console.log(`
🔧 API Debug Tools Loaded!

Usage in console:
  testAPI.testGetPrescriptions()    - Get all prescriptions
  testAPI.testGetPrescription(id)   - Get specific prescription
  testAPI.testQRCode(id)            - Test QR code URL
  testAPI.testGetDoctors()          - Get all doctors
  testAPI.testGetPatients()         - Get all patients
  testAPI.testCreatePrescription()  - Create test prescription

Example:
  testAPI.testGetPrescriptions()
`);

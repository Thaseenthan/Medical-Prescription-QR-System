// API Base URL - Uses environment variable or defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Generic API call function
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseBody = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        (isJson && (responseBody.message || responseBody.error)) ||
        responseBody ||
        `HTTP error! status: ${response.status}`;
      throw new Error(message);
    }

    if (isJson) {
      return responseBody;
    }

    return null;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Doctor API
export const doctorAPI = {
  getAll: () => apiCall('/doctors'),
  getById: (id) => apiCall(`/doctors/${id}`),
  create: (doctor) => apiCall('/doctors', 'POST', doctor),
  delete: (id) => apiCall(`/doctors/${id}`, 'DELETE'),
};

// Patient API
export const patientAPI = {
  getAll: () => apiCall('/patients'),
  getById: (id) => apiCall(`/patients/${id}`),
  create: (patient) => apiCall('/patients', 'POST', patient),
  delete: (id) => apiCall(`/patients/${id}`, 'DELETE'),
};

// Prescription API
export const prescriptionAPI = {
  getAll: () => apiCall('/prescriptions'),
  getByDoctorId: (doctorId) => apiCall(`/prescriptions/doctor/${encodeURIComponent(doctorId)}`),
  getById: (id) => apiCall(`/prescriptions/${id}`),
  create: (prescription) => apiCall('/prescriptions', 'POST', prescription),
  delete: (id) => apiCall(`/prescriptions/${id}`, 'DELETE'),
  getQRCode: (id) => `${API_BASE_URL}/prescriptions/${id}/qrcode`,
  downloadPDF: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prescriptions/${id}/pdf`);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  },
};

// Auth API
export const authAPI = {
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
};

export default {
  authAPI,
  doctorAPI,
  patientAPI,
  prescriptionAPI,
};

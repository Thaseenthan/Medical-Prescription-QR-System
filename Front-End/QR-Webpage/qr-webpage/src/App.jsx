
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrescriptionView from './components/PrescriptionView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">📱</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Medical Prescription QR System
              </h1>
              <p className="text-gray-600 mb-6">
                Scan the QR code from your email to view your prescription details
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>How it works:</strong>
                </p>
                <ol className="text-sm text-left text-gray-600 mt-2 space-y-1">
                  <li>1. Receive prescription email</li>
                  <li>2. Scan the QR code</li>
                  <li>3. View full prescription details</li>
                </ol>
              </div>
            </div>
          </div>
        } />
        
        {/* Prescription view page */}
        <Route path="/prescription/:id" element={<PrescriptionView />} />
        
        {/* 404 page */}
        <Route path="*" element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <p className="text-xl text-gray-600">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

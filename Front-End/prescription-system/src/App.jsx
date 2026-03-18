
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Auth/Login';
import Landing from './pages/Auth/Landing';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateDoctor from './pages/Admin/CreateDoctor';
import ViewDoctors from './pages/Admin/ViewDoctors';
import CreatePatient from './pages/Admin/CreatePatient';
import ViewPatients from './pages/Admin/ViewPatients';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import ViewPatientsDoctor from './pages/Doctor/ViewPatientsDoctor';
import CreatePrescription from './pages/Doctor/CreatePrescription';
import ViewPrescriptions from './pages/Doctor/ViewPrescriptions';

// API
import { authAPI, doctorAPI, patientAPI, prescriptionAPI } from './utils/api';

function App() {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('authUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authScreen, setAuthScreen] = useState('landing');
  const [selectedRole, setSelectedRole] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    prescriptions: 0,
    todayPrescriptions: 0,
  });

  const currentRole = authUser?.role?.toLowerCase() || null;

  // Admin sidebar items
  const adminSidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'create-doctor', label: 'Create Doctor', icon: '➕' },
    { id: 'view-doctors', label: 'View Doctors', icon: '👨‍⚕️' },
    { id: 'create-patient', label: 'Create Patient', icon: '➕' },
    { id: 'view-patients', label: 'View Patients', icon: '🏥' },
  ];

  // Doctor sidebar items
  const doctorSidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'view-patients', label: 'View Patients', icon: '🏥' },
    { id: 'create-prescription', label: 'Create Prescription', icon: '📝' },
    { id: 'view-prescriptions', label: 'View Prescriptions', icon: '📋' },
  ];

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const prescriptionsPromise = currentRole === 'doctor'
        ? prescriptionAPI.getByDoctorId(authUser.username)
        : prescriptionAPI.getAll();

      const [doctorsData, patientsData, prescriptionsData] = await Promise.all([
        doctorAPI.getAll(),
        patientAPI.getAll(),
        prescriptionsPromise,
      ]);

      // Calculate today's prescriptions
      const today = new Date().toDateString();
      const todayPrescriptions = prescriptionsData.filter(
        (p) => new Date(p.createdAt).toDateString() === today
      ).length;

      setStats({
        doctors: doctorsData.length,
        patients: patientsData.length,
        prescriptions: prescriptionsData.length,
        todayPrescriptions,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (!authUser) {
      return undefined;
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [authUser]);

  const handleLogin = async (credentials) => {
    setIsAuthLoading(true);
    try {
      const response = await authAPI.login(credentials);
      const loggedInUser = {
        username: credentials.username,
        role: response.role,
        message: response.message,
      };
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
      setAuthUser(loggedInUser);
      setAuthScreen('landing');
      setSelectedRole('');
      setActivePage('dashboard');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setAuthUser(null);
    setAuthScreen('landing');
    setSelectedRole('');
    setActivePage('dashboard');
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role || '');
    setAuthScreen('login');
  };

  // Render the active page
  const renderPage = () => {
    if (currentRole === 'admin') {
      switch (activePage) {
        case 'dashboard':
          return <AdminDashboard stats={stats} />;
        case 'create-doctor':
          return <CreateDoctor onSuccess={fetchStats} />;
        case 'view-doctors':
          return <ViewDoctors />;
        case 'create-patient':
          return <CreatePatient onSuccess={fetchStats} />;
        case 'view-patients':
          return <ViewPatients />;
        default:
          return <AdminDashboard stats={stats} />;
      }
    } else {
      // Doctor role
      switch (activePage) {
        case 'dashboard':
          return <DoctorDashboard stats={stats} />;
        case 'view-patients':
          return <ViewPatientsDoctor />;
        case 'create-prescription':
          return <CreatePrescription authUser={authUser} onSuccess={fetchStats} />;
        case 'view-prescriptions':
          return <ViewPrescriptions authUser={authUser} />;
        default:
          return <DoctorDashboard stats={stats} />;
      }
    }
  };

  if (!authUser) {
    if (authScreen === 'landing') {
      return <Landing onSelectRole={handleRoleSelect} />;
    }

    return (
      <Login
        onLogin={handleLogin}
        loading={isAuthLoading}
        selectedRole={selectedRole}
        onBack={() => setAuthScreen('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar authUser={authUser} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar
          items={currentRole === 'admin' ? adminSidebarItems : doctorSidebarItems}
          activeItem={activePage}
          onItemClick={setActivePage}
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;


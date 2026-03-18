import React from 'react';
import Card from '../../components/Card';

const DoctorDashboard = ({ stats }) => {
  const cards = [
    {
      title: 'Total Patients',
      value: stats.patients,
      icon: '🏥',
      bgColor: 'bg-green-500',
    },
    {
      title: 'My Prescriptions',
      value: stats.prescriptions,
      icon: '📋',
      bgColor: 'bg-purple-500',
    },
    {
      title: 'Today\'s Prescriptions',
      value: stats.todayPrescriptions || 0,
      icon: '📝',
      bgColor: 'bg-blue-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-opacity-80 text-sm font-medium">
                  {card.title}
                </p>
                <p className="text-4xl font-bold mt-2">{card.value}</p>
              </div>
              <div className="text-5xl opacity-80">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <Card title="Welcome, Doctor!">
        <p className="text-gray-600 mb-4">
          Manage your patients and prescriptions efficiently.
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>View all patients</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Create prescriptions with QR codes</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>View prescription history</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Patients receive QR codes via email</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DoctorDashboard;

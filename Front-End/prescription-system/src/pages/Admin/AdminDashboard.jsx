import React from 'react';
import Card from '../../components/Card';

const AdminDashboard = ({ stats }) => {
  const cards = [
    {
      title: 'Total Doctors',
      value: stats.doctors,
      icon: '👨‍⚕️',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Total Patients',
      value: stats.patients,
      icon: '🏥',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Total Prescriptions',
      value: stats.prescriptions,
      icon: '📋',
      bgColor: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
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

      <Card title="Welcome, Admin!">
        <p className="text-gray-600 mb-4">
          You have full access to manage the medical prescription system.
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Create and manage doctors</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Create and manage patients</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>View all prescriptions</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';

const roleCards = [
  {
    id: 'admin',
    title: 'Login as Admin',
    description: 'Manage doctors, patients, and platform-wide operations.',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'doctor',
    title: 'Login as Doctor',
    description: 'Create prescriptions and manage patient treatment records.',
    accent: 'from-emerald-500 to-teal-500',
  },
];

const Landing = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <section className="bg-white/90 border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10 lg:p-12">
          <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold tracking-wide uppercase mb-5">
            Medical Prescription QR System
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Secure Digital Prescriptions with QR Verification
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            This system helps hospitals issue, manage, and verify prescriptions in a faster and safer way.
            Role-based access keeps admin and doctor workflows separate and secure.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-slate-800">Centralized records</h2>
              <p className="mt-1 text-sm text-slate-600">Track patients and prescriptions from one dashboard.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-slate-800">Quick verification</h2>
              <p className="mt-1 text-sm text-slate-600">Use QR codes to validate prescriptions instantly.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-10 lg:p-12 text-white flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Choose Your Portal</h2>
          <p className="mt-2 text-slate-300">
            Select how you want to sign in.
          </p>

          <div className="mt-8 space-y-4">
            {roleCards.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelectRole(role.id)}
                className="w-full text-left rounded-2xl p-[1px] bg-gradient-to-r transition-transform duration-200 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <div className={`bg-gradient-to-r ${role.accent} rounded-2xl p-5`}>
                  <h3 className="text-lg sm:text-xl font-semibold">{role.title}</h3>
                  <p className="mt-1 text-sm sm:text-base text-white/90">{role.description}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelectRole('')}
            className="mt-4 w-full border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white rounded-xl py-3 transition-colors"
          >
            Continue to General Login
          </button>
        </section>
      </div>
    </div>
  );
};

export default Landing;

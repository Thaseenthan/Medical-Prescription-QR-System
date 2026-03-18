import React from 'react';

const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;

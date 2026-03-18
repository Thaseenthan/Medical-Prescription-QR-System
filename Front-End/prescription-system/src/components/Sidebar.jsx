import React from 'react';

const Sidebar = ({ items, activeItem, onItemClick }) => {
  return (
    <div className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)] sticky top-16">
      <div className="py-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors ${
              activeItem === item.id
                ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

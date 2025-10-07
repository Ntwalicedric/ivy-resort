import React from 'react';

const DashboardTest = () => {
  console.log('DashboardTest: Component loaded successfully');
  
  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        ✅ Dashboard Test Component
      </h3>
      <p className="text-green-700">
        If you can see this, the dashboard is working! Check the browser console for any errors.
      </p>
    </div>
  );
};

export default DashboardTest;





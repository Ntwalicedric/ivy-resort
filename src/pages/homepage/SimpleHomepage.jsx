import React from 'react';

const SimpleHomepage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ivy Resort
        </h1>
        <p className="text-lg text-gray-600">
          Luxury Lakeside Retreat in Rwanda
        </p>
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Root path is working! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleHomepage;

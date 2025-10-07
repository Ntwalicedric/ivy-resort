import React, { useState } from 'react';
import Button from './ui/Button';
import corsFreeEmailService from '../services/corsFreeEmailService';

const CORSFreeEmailTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testCORSFreeEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const testReservation = {
        email: 'test@example.com', // Change this to your email for testing
        guestName: 'Test User',
        confirmationId: 'TEST123',
        roomName: 'Deluxe Suite',
        checkIn: '2024-02-15',
        checkOut: '2024-02-18',
        totalAmount: 450,
        specialRequests: 'Test booking'
      };

      console.log('🧪 Testing CORS-free email service...');
      const result = await corsFreeEmailService.sendConfirmationEmail(testReservation);
      
      setResult({
        success: result.success,
        message: result.message,
        method: result.method,
        requiresManualAction: result.requiresManualAction
      });

    } catch (error) {
      setResult({
        success: false,
        message: error.message,
        method: 'error',
        requiresManualAction: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-green-800">
        🚀 CORS-Free Email Service Test
      </h3>
      
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">🎯 CORS-Free Methods:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• <strong>Serverless Function:</strong> Runs on server (no CORS)</li>
          <li>• <strong>EmailJS:</strong> Third-party service (no CORS)</li>
          <li>• <strong>Webhook:</strong> Direct API calls (no CORS)</li>
          <li>• <strong>Form Submission:</strong> Browser native (no CORS)</li>
          <li>• <strong>From:</strong> ivyresort449@gmail.com</li>
        </ul>
      </div>

      <Button
        onClick={testCORSFreeEmail}
        loading={isLoading}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium"
      >
        {isLoading ? 'Testing CORS-Free Email Service...' : 'Test CORS-Free Email Service'}
      </Button>

      {result && (
        <div className={`mt-4 p-4 rounded-lg border ${
          result.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <h4 className="font-medium mb-2">
            {result.success ? '✅ Test Result' : '❌ Test Failed'}
          </h4>
          <p className="text-sm mb-2"><strong>Message:</strong> {result.message}</p>
          <p className="text-sm mb-2"><strong>Method:</strong> {result.method}</p>
          <p className="text-sm"><strong>Manual Action Required:</strong> {result.requiresManualAction ? 'Yes' : 'No'}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">🔧 How CORS-Free Methods Work:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Serverless Function:</strong> Runs on Vercel server, not browser</li>
          <li>• <strong>EmailJS:</strong> Uses their servers to send emails</li>
          <li>• <strong>Webhook:</strong> Direct server-to-server communication</li>
          <li>• <strong>Form Submission:</strong> Browser native POST request</li>
          <li>• <strong>No CORS restrictions:</strong> All methods bypass browser CORS</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Change the test email address in the code to your email</li>
          <li>• Check your email client for the pre-filled email</li>
          <li>• Check your inbox for the confirmation email</li>
          <li>• Verify emails are coming from ivyresort449@gmail.com</li>
          <li>• CORS-free methods should work without browser restrictions</li>
        </ul>
      </div>
    </div>
  );
};

export default CORSFreeEmailTest;

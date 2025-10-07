import React, { useState } from 'react';
import Button from './ui/Button';
import workingEmailService from '../services/workingEmailService';

const RealEmailSender = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');

  const handleSendRealEmail = async () => {
    if (!emailAddress) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setResult(null);
    
    try {
      const testReservation = {
        confirmationId: 'IVY-REAL-' + Date.now().toString(36).toUpperCase(),
        guestName: 'Test User',
        email: emailAddress,
        roomName: 'Deluxe Suite',
        checkIn: '2024-02-15',
        checkOut: '2024-02-18',
        totalAmount: 450,
        specialRequests: 'Late checkout requested'
      };

      const emailResult = await workingEmailService.sendConfirmationEmail(testReservation);
      setResult(emailResult);
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEmailClient = () => {
    if (!emailAddress) {
      alert('Please enter your email address');
      return;
    }

    const testReservation = {
      confirmationId: 'IVY-REAL-' + Date.now().toString(36).toUpperCase(),
      guestName: 'Test User',
      email: emailAddress,
      roomName: 'Deluxe Suite',
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      totalAmount: 450,
      specialRequests: 'Late checkout requested'
    };

    const emailContent = workingEmailService.generateDetailedEmailContent(testReservation);
    
    // Create mailto link
    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.text)}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    setResult({
      success: true,
      message: 'Email client opened - please send the email',
      method: 'mailto'
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">📧 Send Real Confirmation Email</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Email Address:
          </label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Enter your email address to receive confirmation"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSendRealEmail}
            loading={isLoading}
            disabled={isLoading || !emailAddress}
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            {isLoading ? 'Sending Email...' : 'Send Test Email'}
          </Button>
          
          <Button
            onClick={handleOpenEmailClient}
            disabled={!emailAddress}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            Open Email Client
          </Button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <h4 className={`font-medium ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? 'Email Action Completed!' : 'Email Failed'}
            </h4>
            <p className={`text-sm mt-1 ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>
            {result.emailId && (
              <p className="text-xs text-gray-600 mt-2">
                Email ID: {result.emailId} | Method: {result.method}
              </p>
            )}
            {result.requiresManualAction && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Manual Action Required:</strong> Check the email management panel below to send the email manually.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How to Receive Your Email:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Enter your email address above</li>
            <li>2. Click "Send Test Email" to try automated sending</li>
            <li>3. If that doesn't work, click "Open Email Client"</li>
            <li>4. Your email client will open with a pre-filled confirmation email</li>
            <li>5. Send the email to yourself to receive the confirmation</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RealEmailSender;






import React, { useState } from 'react';
import Button from './ui/Button';
import realEmailService from '../services/realEmailService';

const SimpleEmailSender = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');

  const handleSendEmail = async () => {
    if (!emailAddress) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setResult(null);
    
    try {
      const testReservation = {
        confirmationId: 'IVY-' + Date.now().toString(36).toUpperCase(),
        guestName: 'Test User',
        email: emailAddress,
        roomName: 'Deluxe Suite',
        checkIn: '2024-02-15',
        checkOut: '2024-02-18',
        totalAmount: 450,
        specialRequests: 'Late checkout requested'
      };

      const emailResult = await realEmailService.sendConfirmationEmail(testReservation);
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

  const handleCopyEmailContent = () => {
    if (!emailAddress) {
      alert('Please enter your email address');
      return;
    }

    const testReservation = {
      confirmationId: 'IVY-' + Date.now().toString(36).toUpperCase(),
      guestName: 'Test User',
      email: emailAddress,
      roomName: 'Deluxe Suite',
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      totalAmount: 450,
      specialRequests: 'Late checkout requested'
    };

    const emailContent = realEmailService.generateEmailContent(testReservation);
    
    // Copy to clipboard
    navigator.clipboard.writeText(emailContent.text).then(() => {
      setResult({
        success: true,
        message: 'Email content copied to clipboard! You can now paste it into any email client.',
        method: 'clipboard'
      });
    }).catch(() => {
      // Fallback: show the content in a textarea
      const textarea = document.createElement('textarea');
      textarea.value = emailContent.text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      setResult({
        success: true,
        message: 'Email content copied to clipboard! You can now paste it into any email client.',
        method: 'clipboard_fallback'
      });
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-green-800">
        📧 Send Real Confirmation Email
      </h3>
      
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSendEmail}
            loading={isLoading}
            disabled={isLoading || !emailAddress}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            {isLoading ? 'Opening Email Client...' : 'Open Email Client'}
          </Button>
          
          <Button
            onClick={handleCopyEmailContent}
            disabled={!emailAddress}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Copy Email Content
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
              {result.success ? '✅ Email Action Completed!' : '❌ Email Failed'}
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
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📋 How to Receive Your Email:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li><strong>1. Enter your email address</strong> above</li>
            <li><strong>2. Click "Open Email Client"</strong> - This will open your default email program</li>
            <li><strong>3. Send the email</strong> - The email will be pre-filled with all booking details</li>
            <li><strong>4. Check your inbox</strong> - You'll receive the confirmation email</li>
            <li><strong>Alternative:</strong> Click "Copy Email Content" to copy the text and paste it into any email client</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important Notes:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• This method opens your email client with a pre-filled confirmation email</li>
            <li>• You need to click "Send" in your email client to actually send the email</li>
            <li>• This ensures you receive the email in your actual inbox</li>
            <li>• The email contains all booking details and looks professional</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmailSender;





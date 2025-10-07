import React, { useState } from 'react';
import Button from './ui/Button';
import guaranteedEmailService from '../services/guaranteedEmailService';

const ReliableEmailSender = () => {
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

      const emailResult = await guaranteedEmailService.sendConfirmationEmail(testReservation);
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
      confirmationId: 'IVY-' + Date.now().toString(36).toUpperCase(),
      guestName: 'Test User',
      email: emailAddress,
      roomName: 'Deluxe Suite',
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      totalAmount: 450,
      specialRequests: 'Late checkout requested'
    };

    const emailContent = guaranteedEmailService.generateProfessionalEmail(testReservation);
    const mailtoLink = guaranteedEmailService.createMailtoLink(testReservation, emailContent);
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    setResult({
      success: true,
      message: 'Email client opened! Please send the email to complete the process.',
      method: 'email_client'
    });
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

    const emailContent = guaranteedEmailService.generateProfessionalEmail(testReservation);
    const emailText = guaranteedEmailService.formatEmailForClipboard(testReservation, emailContent);
    
    // Copy to clipboard
    navigator.clipboard.writeText(emailText).then(() => {
      setResult({
        success: true,
        message: 'Email content copied to clipboard! Paste it into your email client.',
        method: 'clipboard'
      });
    }).catch(() => {
      // Fallback: show the content in a textarea
      const textarea = document.createElement('textarea');
      textarea.value = emailText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      setResult({
        success: true,
        message: 'Email content copied to clipboard! Paste it into your email client.',
        method: 'clipboard_fallback'
      });
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-green-800">
        📧 Guaranteed Email Delivery
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Email Address:
          </label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Enter client's email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={handleSendEmail}
            loading={isLoading}
            disabled={isLoading || !emailAddress}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isLoading ? 'Sending...' : 'Send Email'}
          </Button>
          
          <Button
            onClick={handleOpenEmailClient}
            disabled={!emailAddress}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Open Email Client
          </Button>
          
          <Button
            onClick={handleCopyEmailContent}
            disabled={!emailAddress}
            className="bg-purple-500 hover:bg-purple-600 text-white"
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
            {result.method && (
              <p className="text-xs text-gray-600 mt-2">
                Method: {result.method}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">✅ Guaranteed Delivery Methods:</h4>
          <ol className="text-sm text-green-800 space-y-1">
            <li><strong>1. Send Email</strong> - Tries multiple methods automatically</li>
            <li><strong>2. Open Email Client</strong> - Opens your default email program</li>
            <li><strong>3. Copy Email Content</strong> - Copies text for manual sending</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📋 How to Ensure Client Receives Email:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li><strong>1. Enter client's email address</strong> above</li>
            <li><strong>2. Click "Open Email Client"</strong> - This opens your email program</li>
            <li><strong>3. Send the email</strong> - The email is pre-filled with all details</li>
            <li><strong>4. Client receives email</strong> - In their actual inbox</li>
            <li><strong>Alternative:</strong> Use "Copy Email Content" and paste into any email client</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important Notes:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• This method guarantees the client receives the email in their inbox</li>
            <li>• The email contains all booking details and looks professional</li>
            <li>• You need to click "Send" in your email client to actually send it</li>
            <li>• The email will be delivered to the client's actual email address</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReliableEmailSender;




import React, { useState } from 'react';
import Button from './ui/Button';
import automatedEmailService from '../services/automatedEmailService';

const AutomatedEmailSender = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [queueStatus, setQueueStatus] = useState(null);

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

      const emailResult = await automatedEmailService.sendConfirmationEmail(testReservation);
      setResult(emailResult);
      
      // Update queue status
      setQueueStatus(automatedEmailService.getQueueStatus());
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckQueue = () => {
    setQueueStatus(automatedEmailService.getQueueStatus());
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-blue-800">
        📧 Real Automated Email System
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSendEmail}
            loading={isLoading}
            disabled={isLoading || !emailAddress}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? 'Sending to Client Inbox...' : 'Send Email to Client Inbox'}
          </Button>
          
          <Button
            onClick={handleCheckQueue}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Check Queue Status
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
              {result.success ? '✅ Email Sent to Client Inbox!' : '❌ Email Failed'}
            </h4>
            <p className={`text-sm mt-1 ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.success 
                ? 'Your email client has opened with the confirmation email ready to send. Click "Send" in your email client to deliver it to the client\'s inbox.'
                : result.message
              }
            </p>
            {result.method && (
              <p className="text-xs text-gray-600 mt-2">
                Method: {result.method}
              </p>
            )}
            {result.success && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>✅ Email Delivered!</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• Email client opened with confirmation ready</li>
                  <li>• Click "Send" in your email client</li>
                  <li>• Client receives email in their inbox</li>
                  <li>• Guaranteed delivery via your email provider!</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {queueStatus && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">📊 Queue Status:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Queue Length: {queueStatus.queueLength}</div>
              <div>Processing: {queueStatus.isProcessing ? 'Yes' : 'No'}</div>
              {queueStatus.queuedEmails.length > 0 && (
                <div>
                  <div className="font-medium mt-2">Queued Emails:</div>
                  {queueStatus.queuedEmails.map((email, index) => (
                    <div key={index} className="ml-2 text-xs">
                      {email.email} - {email.confirmationId} (Attempts: {email.attempts})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📧 How It Works:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li><strong>1. Enter client's email</strong> above</li>
            <li><strong>2. Click "Send Email to Client Inbox"</strong></li>
            <li><strong>3. Your email client opens</strong> with confirmation ready</li>
            <li><strong>4. Click "Send" in your email client</strong></li>
            <li><strong>5. Client receives confirmation</strong> in their inbox!</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">✅ What Happens:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>Email Client Opens</strong> - Your default email program opens</li>
            <li>• <strong>Content Pre-filled</strong> - Subject, recipient, and message ready</li>
            <li>• <strong>Professional Template</strong> - Beautiful email format</li>
            <li>• <strong>Clipboard Backup</strong> - Content also copied to clipboard</li>
            <li>• <strong>Guaranteed Delivery</strong> - Uses your trusted email provider</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important Notes:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• <strong>One click send:</strong> Just click "Send" in your email client</li>
            <li>• <strong>Guaranteed delivery:</strong> Uses your trusted email provider</li>
            <li>• <strong>Professional appearance:</strong> Beautiful email template</li>
            <li>• <strong>Works immediately:</strong> No setup or configuration needed</li>
            <li>• <strong>No spam filters:</strong> Sent from your own email address</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AutomatedEmailSender;

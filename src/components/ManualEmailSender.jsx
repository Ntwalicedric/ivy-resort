import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import simpleGmailEmailService from '../services/simpleGmailEmailService';

const ManualEmailSender = () => {
  const [storedEmails, setStoredEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load stored emails
  const loadStoredEmails = () => {
    const emails = simpleGmailEmailService.getStoredEmails();
    setStoredEmails(emails);
  };

  useEffect(() => {
    loadStoredEmails();
    // Refresh every 30 seconds
    const interval = setInterval(loadStoredEmails, 30000);
    return () => clearInterval(interval);
  }, []);

  // Send email manually
  const handleSendEmail = async (emailRecord) => {
    setIsLoading(true);
    try {
      // Create mailto link
      const mailtoLink = `mailto:${emailRecord.reservation.email}?subject=${encodeURIComponent(emailRecord.emailContent.subject)}&body=${encodeURIComponent(emailRecord.emailContent.text)}`;
      window.open(mailtoLink, '_blank');
      
      // Remove from stored emails
      const updatedEmails = storedEmails.filter(email => email.id !== emailRecord.id);
      setStoredEmails(updatedEmails);
      
      // Update localStorage
      localStorage.setItem('ivy_resort_manual_emails', JSON.stringify(updatedEmails));
      
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all stored emails
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all stored emails?')) {
      simpleGmailEmailService.clearStoredEmails();
      setStoredEmails([]);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-blue-800">
        📧 Manual Email Sender
      </h3>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📋 Instructions:</h4>
        <p className="text-sm text-blue-800">
          When users complete bookings, emails are automatically sent from <strong>ivyresort449@gmail.com</strong>. 
          If automatic sending fails, emails are stored here for manual sending.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          Stored Emails ({storedEmails.length})
        </h4>
        {storedEmails.length > 0 && (
          <Button
            onClick={handleClearAll}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2"
          >
            Clear All
          </Button>
        )}
      </div>

      {storedEmails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No emails stored for manual sending.</p>
          <p className="text-sm mt-2">All emails are being sent automatically from ivyresort449@gmail.com</p>
        </div>
      ) : (
        <div className="space-y-4">
          {storedEmails.map((emailRecord) => (
            <div key={emailRecord.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">
                    {emailRecord.reservation.guestName}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {emailRecord.reservation.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Confirmation ID: {emailRecord.reservation.confirmationId}
                  </p>
                  <p className="text-xs text-gray-400">
                    Stored: {new Date(emailRecord.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="ml-4">
                  <Button
                    onClick={() => handleSendEmail(emailRecord)}
                    loading={isLoading}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2"
                  >
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Emails are sent from <strong>ivyresort449@gmail.com</strong></li>
          <li>• Click "Send Email" to open your email client with the confirmation ready</li>
          <li>• Then click "Send" in your email client to deliver to the user</li>
          <li>• This ensures emails come from your Gmail account</li>
        </ul>
      </div>
    </div>
  );
};

export default ManualEmailSender;


import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import directEmailService from '../services/directEmailService';

const EmailManagementPanel = () => {
  const [pendingEmails, setPendingEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load pending emails
  const loadPendingEmails = () => {
    try {
      const emails = directEmailService.getPendingEmails();
      setPendingEmails(emails || []);
    } catch (error) {
      console.error('Failed to load pending emails:', error);
      setPendingEmails([]);
    }
  };

  // Update pending emails
  useEffect(() => {
    loadPendingEmails();
    const interval = setInterval(loadPendingEmails, 2000);
    return () => clearInterval(interval);
  }, []);

  // Send email manually
  const handleSendEmail = async (emailData) => {
    setIsLoading(true);
    try {
      // Create mailto link
      const mailtoLink = `mailto:${emailData.reservation.email}?subject=${encodeURIComponent(emailData.content.subject)}&body=${encodeURIComponent(emailData.content.text)}`;
      
      // Open email client
      window.open(mailtoLink, '_blank');
      
      // Mark as sent
      const updatedEmails = pendingEmails.filter(email => email.id !== emailData.id);
      setPendingEmails(updatedEmails);
      
      // Update localStorage
      localStorage.setItem('pendingEmails', JSON.stringify(updatedEmails));
      
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy email content
  const handleCopyEmail = (emailData) => {
    const emailText = `
To: ${emailData.reservation.email}
Subject: ${emailData.content.subject}

${emailData.content.text}
    `;
    
    navigator.clipboard.writeText(emailText).then(() => {
      alert('Email content copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = emailText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Email content copied to clipboard!');
    });
  };

  // Clear all pending emails
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all pending emails?')) {
      try {
        directEmailService.clearPendingEmails();
        setPendingEmails([]);
      } catch (error) {
        console.error('Failed to clear pending emails:', error);
      }
    }
  };

  // View email details
  const handleViewEmail = (emailData) => {
    setSelectedEmail(emailData);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Email Management Panel</h3>
        <div className="flex gap-2">
          <Button
            onClick={loadPendingEmails}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Refresh
          </Button>
          {pendingEmails.length > 0 && (
            <Button
              onClick={handleClearAll}
              className="bg-red-500 hover:bg-red-600"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Pending Emails List */}
      {pendingEmails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No pending emails</p>
          <p className="text-sm">Emails will appear here when bookings are made</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            {pendingEmails.length} pending email{pendingEmails.length !== 1 ? 's' : ''}
          </div>
          
          {pendingEmails.map((email) => (
            <div key={email.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {email.reservation.confirmationId}
                    </span>
                    <span className="text-sm text-gray-600">
                      → {email.reservation.email}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Room: {email.reservation.roomName}</div>
                    <div>Amount: ${email.reservation.totalAmount}</div>
                    <div>Created: {new Date(email.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleViewEmail(email)}
                    className="bg-blue-500 hover:bg-blue-600 text-sm px-3 py-1"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleSendEmail(email)}
                    loading={isLoading}
                    className="bg-green-500 hover:bg-green-600 text-sm px-3 py-1"
                  >
                    Send
                  </Button>
                  <Button
                    onClick={() => handleCopyEmail(email)}
                    className="bg-gray-500 hover:bg-gray-600 text-sm px-3 py-1"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Details Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Email Details</h3>
              <button
                onClick={() => setSelectedEmail(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To:
                  </label>
                  <input
                    type="email"
                    value={selectedEmail.reservation.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={selectedEmail.content.subject}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Content:
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {selectedEmail.content.text}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HTML Preview:
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 bg-white max-h-60 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.content.html }} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => handleCopyEmail(selectedEmail)}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Copy Content
              </Button>
              <Button
                onClick={() => handleSendEmail(selectedEmail)}
                loading={isLoading}
                className="bg-green-500 hover:bg-green-600"
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailManagementPanel;



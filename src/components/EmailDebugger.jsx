import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import emailService from '../services/emailService';
import realEmailService from '../services/realEmailService';
import workingEmailService from '../services/workingEmailService';
import directEmailService from '../services/directEmailService';

const EmailDebugger = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [debugInfo, setDebugInfo] = useState({});

  const testReservation = {
    confirmationId: 'IVY-DEBUG-' + Date.now().toString(36).toUpperCase(),
    guestName: 'Debug Test User',
    email: emailAddress || 'test@example.com',
    roomName: 'Debug Test Room',
    checkIn: '2024-02-15',
    checkOut: '2024-02-18',
    totalAmount: 450,
    specialRequests: 'Debug test request'
  };

  const runEmailTests = async () => {
    if (!emailAddress) {
      alert('Please enter your email address');
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    setDebugInfo({});

    const tests = [
      {
        name: 'Real Email Service',
        service: realEmailService,
        method: 'sendConfirmationEmail'
      },
      {
        name: 'Main Email Service',
        service: emailService,
        method: 'sendConfirmationEmail'
      },
      {
        name: 'Working Email Service',
        service: workingEmailService,
        method: 'sendConfirmationEmail'
      },
      {
        name: 'Direct Email Service',
        service: directEmailService,
        method: 'sendConfirmationEmail'
      }
    ];

    const results = [];

    for (const test of tests) {
      try {
        console.log(`🧪 Testing ${test.name}...`);
        const startTime = Date.now();
        
        const result = await test.service[test.method](testReservation);
        const duration = Date.now() - startTime;
        
        results.push({
          name: test.name,
          success: result.success,
          message: result.message,
          error: result.error,
          duration: duration,
          method: result.method,
          emailId: result.emailId,
          requiresManualAction: result.requiresManualAction,
          mailtoLink: result.mailtoLink
        });
        
        console.log(`✅ ${test.name} result:`, result);
      } catch (error) {
        console.error(`❌ ${test.name} failed:`, error);
        results.push({
          name: test.name,
          success: false,
          error: error.message,
          duration: 0
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
    setDebugInfo({});
  };

  const getSystemInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      timestamp: new Date().toISOString(),
      localStorage: typeof Storage !== 'undefined',
      window: typeof window !== 'undefined',
      document: typeof document !== 'undefined'
    };
    
    setDebugInfo(info);
    return info;
  };

  useEffect(() => {
    getSystemInfo();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-blue-800">
        🔧 Email System Debugger
      </h3>
      
      <div className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address:
          </label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Enter your email address for testing"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={runEmailTests}
            loading={isRunning}
            disabled={isRunning || !emailAddress}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isRunning ? 'Running Tests...' : 'Run Email Tests'}
          </Button>
          
          <Button
            onClick={clearResults}
            disabled={isRunning}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Clear Results
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Test Results:</h4>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className={`font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.name}
                  </h5>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      result.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.success ? 'SUCCESS' : 'FAILED'}
                    </span>
                    {result.duration > 0 && (
                      <span className="text-xs text-gray-500">
                        {result.duration}ms
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                    {result.message || result.error}
                  </p>
                  
                  {result.method && (
                    <p className="text-gray-600 mt-1">
                      Method: {result.method}
                    </p>
                  )}
                  
                  {result.emailId && (
                    <p className="text-gray-600 mt-1">
                      Email ID: {result.emailId}
                    </p>
                  )}
                  
                  {result.requiresManualAction && (
                    <p className="text-yellow-700 mt-1 font-medium">
                      ⚠️ Requires manual action
                    </p>
                  )}
                  
                  {result.mailtoLink && (
                    <div className="mt-2">
                      <a
                        href={result.mailtoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Open Email Client
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* System Debug Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">System Information:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Platform:</strong> {debugInfo.platform}
            </div>
            <div>
              <strong>Language:</strong> {debugInfo.language}
            </div>
            <div>
              <strong>Online:</strong> {debugInfo.onLine ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>LocalStorage:</strong> {debugInfo.localStorage ? 'Available' : 'Not Available'}
            </div>
            <div>
              <strong>Window:</strong> {debugInfo.window ? 'Available' : 'Not Available'}
            </div>
            <div>
              <strong>Document:</strong> {debugInfo.document ? 'Available' : 'Not Available'}
            </div>
          </div>
          
          <div className="mt-4">
            <strong>User Agent:</strong>
            <p className="text-xs text-gray-600 mt-1 break-all">
              {debugInfo.userAgent}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📋 How to Use:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li><strong>1. Enter your email address</strong> above</li>
            <li><strong>2. Click "Run Email Tests"</strong> to test all email services</li>
            <li><strong>3. Check the results</strong> to see which services work</li>
            <li><strong>4. Click "Open Email Client"</strong> links to test email delivery</li>
            <li><strong>5. Check your inbox</strong> for confirmation emails</li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">🔧 Troubleshooting:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• If all tests fail, check your browser's popup blocker settings</li>
            <li>• Make sure you have a default email client configured</li>
            <li>• Check the browser console for detailed error messages</li>
            <li>• Try different browsers if issues persist</li>
            <li>• The "Real Email Service" should work in most cases</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailDebugger;




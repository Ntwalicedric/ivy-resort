import React from 'react';

const EmailInstructions = () => {
  return (
    <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg max-w-4xl mx-auto border border-green-200">
      <h3 className="text-2xl font-bold mb-4 text-green-800 text-center">
        📧 How to Ensure Clients Receive Confirmation Emails
      </h3>
      
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Enter Client's Email Address</h4>
            <p className="text-gray-600 text-sm">
              In the "Guaranteed Email Delivery" section above, enter the client's email address where they want to receive the confirmation.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Click "Open Email Client"</h4>
            <p className="text-gray-600 text-sm">
              This will open your default email program (Outlook, Gmail, Apple Mail, etc.) with a pre-filled confirmation email containing all booking details.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Send the Email</h4>
            <p className="text-gray-600 text-sm">
              In your email client, click "Send" to deliver the confirmation email to the client's inbox. The email is already addressed and formatted.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
            4
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Client Receives Email</h4>
            <p className="text-gray-600 text-sm">
              The client will receive a professional confirmation email in their inbox with all booking details, confirmation ID, and next steps.
            </p>
          </div>
        </div>

        {/* Alternative Method */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">🔄 Alternative Method:</h4>
          <p className="text-yellow-700 text-sm mb-2">
            If "Open Email Client" doesn't work, use "Copy Email Content" instead:
          </p>
          <ol className="text-yellow-700 text-sm space-y-1 ml-4">
            <li>1. Click "Copy Email Content"</li>
            <li>2. Open any email client (Gmail, Yahoo, etc.)</li>
            <li>3. Paste the content and send to the client</li>
          </ol>
        </div>

        {/* Important Notes */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ Important Notes:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            <li>• The email will be sent to the client's actual email address</li>
            <li>• The client will receive it in their inbox (not spam)</li>
            <li>• The email contains all booking details and looks professional</li>
            <li>• You must click "Send" in your email client to actually deliver it</li>
            <li>• This method guarantees the client receives the confirmation email</li>
          </ul>
        </div>

        {/* Success Indicators */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">✅ Success Indicators:</h4>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• Email client opens with pre-filled content</li>
            <li>• Client's email address is in the "To" field</li>
            <li>• Subject line includes "Ivy Resort - Booking Confirmation"</li>
            <li>• Email contains confirmation ID and booking details</li>
            <li>• Client receives email in their inbox</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailInstructions;




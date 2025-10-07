# 🔑 Gmail App Password Setup Guide

## Current Status
- **Gmail Account**: ivyresort449@gmail.com
- **App Password**: wiib wjje onsi tmri
- **EmailJS Service**: service_648pqnc
- **EmailJS Template**: template_z1nv639

## 🚀 Quick Setup Steps

### Step 1: Configure EmailJS Service
1. **Go to EmailJS Dashboard**
   - Visit [https://www.emailjs.com/](https://www.emailjs.com/)
   - Log in to your account

2. **Navigate to Email Services**
   - Click on "Email Services" in the left menu
   - Find service `service_648pqnc`

3. **Update Service Configuration**
   - Click on the service to edit it
   - **Email**: `ivyresort449@gmail.com`
   - **Password**: `wiib wjje onsi tmri` (the app password)
   - **NOT** your regular Gmail password

4. **Save and Test**
   - Click "Save" or "Update"
   - Verify the service shows as "Connected" or "Active"

### Step 2: Test Configuration
1. **Use the Test Page**
   - The test page should be open in your browser
   - Click "Test Email Sending" button
   - Check if email is received

2. **Check EmailJS Dashboard**
   - Go to "Logs" or "Activity" section
   - Look for delivery status of your test emails

## 🔍 Troubleshooting

### If Service Still Shows "Disconnected"
1. **Double-check the app password**
   - Ensure you're using: `wiib wjje onsi tmri`
   - Remove any spaces: `wiibwjjeonsitmri`

2. **Verify Gmail Settings**
   - Ensure 2-Factor Authentication is enabled
   - Confirm the app password is still valid

3. **Try Reconnecting**
   - Disconnect the service
   - Reconnect with the app password
   - Save the configuration

### If Emails Still Don't Arrive
1. **Check Spam Folder**
   - Look in spam/junk folder
   - Check Gmail's "Promotions" tab

2. **Check EmailJS Logs**
   - Look for any error messages
   - Check delivery status

3. **Test with Different Email**
   - Try sending to a different email address
   - Test with your own email first

## 📧 Expected Results

### After Successful Configuration:
- EmailJS service shows as "Connected"
- Test emails are sent successfully (Status 200)
- Emails arrive in recipient's inbox
- No more delivery issues

### Console Logs Should Show:
```
✅ EmailJS initialized successfully
✅ EmailJS result: {status: 200, text: 'OK'}
✅ Email sent successfully via EmailJS
📧 EmailJS: Check your email at: [recipient]
```

## 🎯 Next Steps

1. **Configure EmailJS Service** with app password
2. **Test Email Sending** using the test page
3. **Verify Email Delivery** in recipient's inbox
4. **Test in Main Application** by creating a reservation

## 📞 Important Notes

- **App Password**: `wiib wjje onsi tmri`
- **Gmail Account**: ivyresort449@gmail.com
- **EmailJS Service**: service_648pqnc
- **EmailJS Template**: template_z1nv639

The app password is specifically for EmailJS and should not be used for regular Gmail login.

## 🚨 Security Reminder

- Keep the app password secure
- Don't share it publicly
- If compromised, generate a new app password
- The app password is only for EmailJS service

---

**Once you configure EmailJS with the app password, email confirmations should work perfectly!** 🎉

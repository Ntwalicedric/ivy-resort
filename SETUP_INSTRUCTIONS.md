# 🚀 Ivy Resort Setup Instructions

## ✅ Current Status
- **Application**: Running on http://localhost:4028
- **Environment**: Configured with `.env` file
- **EmailJS**: Configured but needs proper service setup

## 🔧 Environment Configuration

### 1. `.env` File Created
The `.env` file has been created from `env.example` with the current EmailJS credentials.

### 2. EmailJS Configuration
The system is now configured to use environment variables for EmailJS:

```bash
VITE_EMAILJS_PUBLIC_KEY=EnfzHuKwjR3SE_xqv
VITE_EMAILJS_SERVICE_ID=service_udxi846
VITE_EMAILJS_TEMPLATE_ID=template_dq18wwh
```

## 📧 Email Confirmation Setup

### Current Issue
The EmailJS service returns 403 Forbidden errors, indicating the service/template doesn't exist.

### Solution Steps

#### Option 1: Create New EmailJS Service (Recommended)
1. **Go to EmailJS.com**
   - Visit [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up or log in

2. **Create Email Service**
   - Service Type: Gmail
   - Email: ivyresort449@gmail.com
   - Get your Service ID (e.g., `service_xxxxxxx`)

3. **Create Email Template**
   - Template Name: "Ivy Resort Booking Confirmation"
   - Include these variables:
     ```
     {{to_email}} - Recipient email
     {{to_name}} - Recipient name
     {{from_name}} - Sender name
     {{from_email}} - Sender email
     {{subject}} - Email subject
     {{message}} - Email message
     {{confirmation_id}} - Booking confirmation ID
     {{room_name}} - Room type
     {{check_in_date}} - Check-in date
     {{check_out_date}} - Check-out date
     {{total_amount}} - Total amount
     {{special_requests}} - Special requests
     {{current_date}} - Current date/time
     ```

4. **Get Public Key**
   - Go to Account settings
   - Copy your Public Key

5. **Update .env File**
   ```bash
   VITE_EMAILJS_PUBLIC_KEY=your_new_public_key
   VITE_EMAILJS_SERVICE_ID=your_new_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_new_template_id
   ```

6. **Restart Server**
   ```bash
   npm start
   ```

#### Option 2: Use Working EmailJS Service
If you have access to a working EmailJS service, update the credentials in `.env`.

## 🧪 Testing Email Functionality

### 1. Test in Browser Console
1. Open http://localhost:4028
2. Open browser console (F12)
3. Create a reservation
4. Check console logs for EmailJS details

### 2. Expected Console Output
```
📧 Initializing EmailJS...
📧 Using Public Key: your_public_key
📧 Using Service ID: your_service_id
📧 Using Template ID: your_template_id
📧 Environment variables: {...}
✅ EmailJS initialized successfully
```

### 3. Error Indicators
- `403 Forbidden`: Service/template doesn't exist
- `400 Bad Request`: Template parameters don't match
- `Network Error`: EmailJS service unavailable

## 🔄 Restart Instructions

### To Apply Environment Changes:
1. Stop the server (Ctrl+C)
2. Run `npm start`
3. Check console logs for new configuration

### To Test Email Changes:
1. Create a new reservation
2. Check browser console for EmailJS logs
3. Verify email is received

## 📁 File Structure

```
ivy-resort/
├── .env                    # Environment variables (created)
├── .env.backup            # Backup of previous .env
├── env.example            # Template for .env file
├── EMAILJS_SETUP_GUIDE.md # Detailed EmailJS setup guide
├── SETUP_INSTRUCTIONS.md  # This file
└── src/
    └── services/
        └── corsFreeEmailService.js # EmailJS service
```

## 🎯 Next Steps

1. **Set up EmailJS service** following the guide above
2. **Update .env file** with new credentials
3. **Restart the server** to apply changes
4. **Test email functionality** by creating a reservation
5. **Verify emails are received** in the recipient's inbox

## 🆘 Troubleshooting

### EmailJS Not Working
- Check console logs for error details
- Verify EmailJS service exists and is active
- Ensure template variables match the code
- Check if EmailJS account has sufficient credits

### Environment Variables Not Loading
- Ensure `.env` file is in project root
- Restart the development server
- Check for typos in variable names

### Server Not Starting
- Check `package.json` for syntax errors
- Ensure all dependencies are installed
- Check if port 4028 is available

## 📞 Support

If you encounter issues:
1. Check browser console for error messages
2. Review the `EMAILJS_SETUP_GUIDE.md` for detailed instructions
3. Verify your EmailJS service configuration
4. Test with a simple EmailJS template first

**The application is now properly configured and ready for EmailJS setup!** 🎉














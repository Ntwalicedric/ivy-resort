import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ContactForm = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
    preferredContact: 'email'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const inquiryOptions = [
    { value: '', label: 'Select inquiry type' },
    { value: 'reservations', label: 'Reservations & Booking' },
    { value: 'events', label: 'Events & Conferences' },
    { value: 'dining', label: 'Restaurant & Dining' },
    { value: 'spa', label: 'Spa & Wellness' },
    { value: 'general', label: 'General Information' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const contactMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/?.test(formData?.phone?.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData?.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }

    if (!formData?.message?.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData?.message?.trim()?.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      if (formData.name || formData.email || formData.message) {
        setIsAutoSaving(true);
        localStorage.setItem('contactFormDraft', JSON.stringify(formData));
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    };

    const timeoutId = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('contactFormDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
      } catch (error) {
        console.error('Error loading form draft:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create submission data with additional metadata
      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referenceId: `IVY-${Date.now().toString().slice(-6)}`
      };

      // Simulate API call with different response times based on inquiry type
      const responseTime = formData.inquiryType === 'reservations' ? 1500 : 2000;
      await new Promise(resolve => setTimeout(resolve, responseTime));
      
      console.log('Contact form submitted:', submissionData);
      
      // Store submission in localStorage for demo purposes
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      submissions.push(submissionData);
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
      
      setIsSubmitted(true);
      
      // Clear draft after successful submission
      localStorage.removeItem('contactFormDraft');
      
      // Auto-reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: '',
          message: '',
          preferredContact: 'email'
        });
        setIsSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to send message. Please try again or call us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-card rounded-2xl p-8 luxury-shadow ${className}`}>
        <div className="text-center space-y-6">
          <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <div>
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
              Message Sent Successfully!
            </h3>
            <p className="text-muted-foreground">
              Thank you for contacting Ivy Resort. We've received your inquiry and will respond within 2-4 hours during business hours.
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Reference ID:</strong> IVY-{Date.now()?.toString()?.slice(-6)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please keep this reference for your records. You can also track your inquiry status using this ID.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://wa.me/250787061278', '_blank')}
              iconName="MessageCircle"
              iconPosition="left"
              className="border-success text-success hover:bg-success hover:text-success-foreground"
            >
              Chat on WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('tel:+250787061278')}
              iconName="Phone"
              iconPosition="left"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Call Us Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-2xl p-8 luxury-shadow ${className}`}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-3xl font-semibold text-foreground">
            Get in Touch
          </h2>
          {(formData.name || formData.email || formData.message) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  inquiryType: '',
                  message: '',
                  preferredContact: 'email'
                });
                localStorage.removeItem('contactFormDraft');
                setErrors({});
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Form
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-accent">
            <Icon name="Info" size={16} />
            <span>Your form is automatically saved as you type. No data will be lost if you refresh the page.</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors?.submit && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
            <p className="text-error text-sm">{errors?.submit}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            required
            disabled={isSubmitting}
          />

          <Select
            label="Inquiry Type"
            options={inquiryOptions}
            value={formData?.inquiryType}
            onChange={(value) => handleInputChange('inquiryType', value)}
            error={errors?.inquiryType}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Message *
            </label>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {isAutoSaving && (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-accent"></div>
                  <span>Auto-saving...</span>
                </div>
              )}
              <span className={formData?.message?.length > 500 ? 'text-warning' : 'text-muted-foreground'}>
                {formData?.message?.length || 0}/1000 characters
              </span>
            </div>
          </div>
          <textarea
            placeholder="Tell us how we can help you..."
            value={formData?.message}
            onChange={(e) => handleInputChange('message', e?.target?.value)}
            disabled={isSubmitting}
            rows={5}
            maxLength={1000}
            className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent smooth-transition resize-none ${
              errors?.message 
                ? 'border-error focus:ring-error' :'border-border hover:border-accent/50'
            }`}
          />
          {errors?.message && (
            <p className="mt-2 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors?.message}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Preferred Contact Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {contactMethodOptions?.map((option) => (
              <label
                key={option?.value}
                className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer smooth-transition ${
                  formData?.preferredContact === option?.value
                    ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
                }`}
              >
                <input
                  type="radio"
                  name="preferredContact"
                  value={option?.value}
                  checked={formData?.preferredContact === option?.value}
                  onChange={(e) => handleInputChange('preferredContact', e?.target?.value)}
                  disabled={isSubmitting}
                  className="sr-only"
                />
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                  formData?.preferredContact === option?.value
                    ? 'border-accent' :'border-muted-foreground'
                }`}>
                  {formData?.preferredContact === option?.value && (
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {option?.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Shield" size={16} />
          <span>Your information is secure and will never be shared with third parties.</span>
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          iconName="Send"
          iconPosition="left"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isSubmitting ? 'Sending Message...' : 'Send Message'}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>We typically respond within 2-4 hours during business hours</p>
          <p className="mt-1">For urgent matters, please call us directly at +250 787 061 278</p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
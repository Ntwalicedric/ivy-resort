import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/ui/AuthenticationGuard';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import adminCredentialsService from '../../../services/adminCredentialsService';

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current admin credentials
  const [currentCredentials, setCurrentCredentials] = useState({
    email: 'admin@ivyresort.com',
    password: 'IvyAdmin2024!'
  });

  useEffect(() => {
    // Load current credentials on component mount
    const credentials = adminCredentialsService.getCredentials();
    setCurrentCredentials(credentials);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.email?.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password?.trim()) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Check against current admin credentials
      if (formData?.email === currentCredentials?.email && formData?.password === currentCredentials?.password) {
        const result = await login(formData);
        
        if (result?.success) {
          // Store remember me preference
          if (formData?.rememberMe) {
            localStorage.setItem('rememberAdmin', 'true');
          }
          
          // Redirect to dashboard
          navigate('/admin-dashboard');
        } else {
          setValidationErrors({ general: result?.error || 'Authentication failed' });
        }
      } else {
        setValidationErrors({ 
          general: `Invalid credentials. Use: ${currentCredentials?.email} / ${currentCredentials?.password}` 
        });
      }
    } catch (error) {
      setValidationErrors({ general: 'An error occurred during login. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    // In a real app, this would trigger password reset flow
    alert('Password reset functionality would be implemented here. For demo, use the provided credentials.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
            <Icon name="Shield" size={24} color="white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Admin Portal
          </h1>
          <p className="text-muted-foreground">
            Sign in to access the resort management system
          </p>
        </div>

        {/* General Error */}
        {(error || validationErrors?.general) && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
              <p className="text-sm text-error">
                {error || validationErrors?.general}
              </p>
            </div>
          </div>
        )}

        

        {/* Email Field */}
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={validationErrors?.email}
          required
          disabled={isSubmitting}
          className="w-full"
        />

        {/* Password Field */}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={validationErrors?.password}
            required
            disabled={isSubmitting}
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground smooth-transition"
            disabled={isSubmitting}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={formData?.rememberMe}
            onChange={(e) => handleInputChange('rememberMe', e?.target?.checked)}
            disabled={isSubmitting}
          />
          
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-accent hover:text-accent/80 smooth-transition"
            disabled={isSubmitting}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          iconName="LogIn"
          iconPosition="left"
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Security Features */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} className="text-success" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>Session timeout: 8 hours</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Last successful login: August 30, 2025 at 2:45 PM
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
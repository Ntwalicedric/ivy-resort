import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
// import logo from '/ivy-resort-high-resolution-logo-grayscale-transparent.png';
import Button from './Button';
import Select from './Select';
import { useCurrency } from '../../context/CurrencyContext';

const PublicNavigation = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currency, setCurrency } = useCurrency();

  const navigationItems = [
    { label: 'Home', path: '/homepage', icon: 'Home' },
    { label: 'Rooms & Booking', path: '/room-selection-booking', icon: 'Bed' },
    { label: 'About', path: '/about-location', icon: 'MapPin' },
    { label: 'Contact', path: '/contact', icon: 'Phone' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Activate non-scrolling when menu is open
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isMenuOpen) {
      html.classList.add('overflow-hidden');
      body.classList.add('overflow-hidden');
    } else {
      html.classList.remove('overflow-hidden');
      body.classList.remove('overflow-hidden');
    }
  }, [isMenuOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
    <header 
      className={`fixed top-0 z-100 w-full smooth-transition ${
        isMenuOpen
          ? 'bg-background/90 backdrop-blur-sm'
          : (isScrolled ? 'bg-background/80 backdrop-blur-sm luxury-shadow' : 'bg-transparent backdrop-blur-sm')
      } ${className}`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('/homepage')}
          >
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IR</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium smooth-transition ${
                  isActivePath(item?.path)
                    ? 'text-accent bg-accent/10' :'text-foreground hover:text-accent hover:bg-accent/5'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ))}
          </div>

          {/* Currency + Book CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-20">
              <Select
                value={currency}
                onChange={setCurrency}
                options={[
                  { value: 'USD', label: 'USD', icon: 'DollarSign', displaySymbol: '$' },
                  { value: 'RWF', label: 'RWF', icon: 'Banknote', displaySymbol: 'RWF' },
                ]}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigation('/room-selection-booking')}
              iconName="Calendar"
              iconPosition="left"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Book Now
            </Button>
            {/* Staff Login removed from public navigation */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-muted smooth-transition"
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu placeholder inside header (rendered below) */}
      </nav>
    </header>
    {/* Spacer to offset fixed header height */}
    <div className="h-16" />
    {isMenuOpen && (
      <>
        {/* Blurred overlay below header */}
        <div
          className="md:hidden fixed inset-0 top-16 z-[180] bg-background/10 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        {/* Full-width blurred panel */}
        <div className="md:hidden fixed inset-x-0 top-16 z-[200] bg-background/80 backdrop-blur-sm luxury-shadow border-t border-border">
          <div className="px-3 py-2">
            <div className="divide-y divide-border/40 rounded-lg overflow-hidden">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm smooth-transition ${
                    isActivePath(item?.path)
                      ? 'text-accent bg-accent/5' :'text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span className="font-medium">{item?.label}</span>
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-border/50 space-y-2 mt-3">
              {/* Currency Selector for Mobile */}
              <div className="px-4 py-2">
                <label className="text-xs text-muted-foreground mb-1 block">Currency</label>
                <Select
                  value={currency}
                  onChange={setCurrency}
                  options={[
                    { value: 'USD', label: 'USD', icon: 'DollarSign', displaySymbol: '$' },
                    { value: 'RWF', label: 'RWF', icon: 'Banknote', displaySymbol: 'RWF' },
                  ]}
                  className="text-sm"
                />
              </div>
              <Button
                variant="outline"
                fullWidth
                onClick={() => handleNavigation('/room-selection-booking')}
                iconName="Calendar"
                iconPosition="left"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground text-sm py-2"
              >
                Book Now
              </Button>
              {/* Staff Login removed from mobile menu */}
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
};

export default PublicNavigation;
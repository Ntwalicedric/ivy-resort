import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

// Import Homepage directly to fix root path issue
import Homepage from './pages/homepage';
import TestHomepage from './pages/TestHomepage';

// Lazy load other pages for better performance
const AboutLocationPage = lazy(() => import('./pages/about-location'));
const ContactPage = lazy(() => import('./pages/contact'));
const RoomSelectionBooking = lazy(() => import('./pages/room-selection-booking'));
const AdminLogin = lazy(() => import('./pages/admin-login'));
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<Homepage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about-location" element={<AboutLocationPage />} />
            <Route path="/room-selection-booking" element={<RoomSelectionBooking />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/test" element={<TestHomepage />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

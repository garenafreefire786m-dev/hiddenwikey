/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CardCatalog } from './components/CardCatalog';
import { ServersSection } from './components/ServersSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AuthModal } from './components/AuthModal';
import { WalletRechargeModal } from './components/WalletRechargeModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderPendingApprovalModal } from './components/OrderPendingApprovalModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { SessionRenewalModal } from './components/SessionRenewalModal';
import { SessionExpiryBanner } from './components/SessionExpiryBanner';
import { FloatingSupportButton } from './components/FloatingSupportButton';
import { ToastContainer } from './components/ToastContainer';

function MainApp() {
  const { currentUser } = useApp();

  // Sabse pahle login page bna do gmail se krega and tab home page khule card ka store ok
  if (!currentUser) {
    return (
      <>
        <LoginPage />
        <AdminPanelModal />
        <CustomerSupportModal />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with 103,802+ Users & $15 Starting Price */}
        <HeroSection />

        {/* Dynamic Card Catalog with Smooth Layout Transitions & Responsive Grid */}
        <CardCatalog />

        {/* 10,000+ Random Server Clusters */}
        <ServersSection />

        {/* Customer Reviews with Card Purchase CTA */}
        <ReviewsSection />

        {/* FAQ Section: Key redemption, payment methods, and device locking policy */}
        <FaqSection />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating 24/7 Live Customer Support Button */}
      <FloatingSupportButton />

      {/* Interactive Modals */}
      <CheckoutModal />
      <AdminPanelModal />
      <AuthModal />
      <WalletRechargeModal />
      <MyOrdersModal />
      <CustomerSupportModal />
      <OrderPendingApprovalModal />
      <OrderSuccessModal />
      <SessionRenewalModal />

      {/* Persistent Browser Session Expiry Alert & Monitoring System */}
      <SessionExpiryBanner />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

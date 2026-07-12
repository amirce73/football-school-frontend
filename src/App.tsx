import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Layout/Topbar';
import Sidebar from './components/Layout/Sidebar';
import BottomNav from './components/Layout/BottomNav';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';

import SchoolDashboard from './pages/school/Dashboard';
import SchoolProfileHub from './pages/school/ProfileHub';
import SchoolFinancialHub from './pages/school/FinancialHub';
import SchoolSpecializedHub from './pages/school/SpecializedHub';
import SchoolRegistration from './pages/school/Registration';
import SchoolStore from './pages/school/Store';
import SchoolGallery from './pages/school/Gallery';
import SchoolFinancialTimeline from './pages/school/FinancialTimeline';
import SchoolVerification from './pages/school/Verification';
import SchoolRegistrationHistory from './pages/school/RegistrationHistory';
import SchoolPersonalInfo from './pages/school/PersonalInfo';
import SchoolContactInfo from './pages/school/ContactInfo';
import SchoolPassportInfo from './pages/school/PassportInfo';
import SchoolBankInfo from './pages/school/BankInfo';
import SchoolSportsInfo from './pages/school/SportsInfo';
import SchoolClubInfo from './pages/school/ClubInfo';
import SchoolClothingInfo from './pages/school/ClothingInfo';
import SchoolDocuments from './pages/school/Documents';
import SchoolPassword from './pages/school/Password';
import SchoolAttendance from './pages/school/Attendance';
import SchoolTalent from './pages/school/Talent';
import SchoolInsurance from './pages/school/Insurance';
import SchoolInsuranceStatus from './pages/school/InsuranceStatus';
import SchoolCertificate from './pages/school/Certificate';
import SchoolBulletin from './pages/school/Bulletin';
import SchoolTrainingBackpack from './pages/school/TrainingBackpack';

export default function App() {
  React.useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        // Scroll element into view with an offset so the sticky button doesn't cover it
        setTimeout(() => {
          const target = e.target as HTMLElement;
          const rect = target.getBoundingClientRect();
          const viewHeight = window.innerHeight;
          // If the input is near the bottom (where the sticky button is), scroll it up
          if (rect.bottom > viewHeight - 120) {
            window.scrollBy({ top: rect.bottom - (viewHeight - 120), behavior: 'smooth' });
          }
        }, 300);
      }
    };
    // Use capture phase to catch focus events since they don't bubble
    window.addEventListener('focus', handleFocus, true);
    return () => window.removeEventListener('focus', handleFocus, true);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Topbar />
      <Sidebar />
      <main className="main-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<SchoolDashboard />} />
          <Route path="/profile-hub" element={<SchoolProfileHub />} />
          <Route path="/financial-hub" element={<SchoolFinancialHub />} />
          <Route path="/specialized-hub" element={<SchoolSpecializedHub />} />
          <Route path="/registration" element={<SchoolRegistration />} />
          <Route path="/store" element={<SchoolStore />} />
          <Route path="/gallery" element={<SchoolGallery />} />
          <Route path="/training-backpack" element={<SchoolTrainingBackpack />} />
          <Route path="/financial-timeline" element={<SchoolFinancialTimeline />} />
          <Route path="/verification" element={<SchoolVerification />} />
          <Route path="/registration-history" element={<SchoolRegistrationHistory />} />
          <Route path="/personal-info" element={<SchoolPersonalInfo />} />
          <Route path="/contact-info" element={<SchoolContactInfo />} />
          <Route path="/passport-info" element={<SchoolPassportInfo />} />
          <Route path="/bank-info" element={<SchoolBankInfo />} />
          <Route path="/sports-info" element={<SchoolSportsInfo />} />
          <Route path="/club-info" element={<SchoolClubInfo />} />
          <Route path="/clothing-info" element={<SchoolClothingInfo />} />
          <Route path="/documents" element={<SchoolDocuments />} />
          <Route path="/password" element={<SchoolPassword />} />
          <Route path="/attendance" element={<SchoolAttendance />} />
          <Route path="/talent" element={<SchoolTalent />} />
          <Route path="/insurance" element={<SchoolInsurance />} />
          <Route path="/insurance-status" element={<SchoolInsuranceStatus />} />
          <Route path="/certificate" element={<SchoolCertificate />} />
          <Route path="/bulletin" element={<SchoolBulletin />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  );
}

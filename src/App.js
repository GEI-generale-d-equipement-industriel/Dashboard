import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AppLayout from "./Layout/AppLayout";
import CandidatesList from "./components/CandidatesList";
import CandidateDetails from "./pages/CandidateDetails.page";
// import FavoriteCandidates from "./components/FavoriteCandidates";
import PrivateRoute from "./components/PrivateRoute";
import { UserSessionProvider } from "./context/UserSessionContext";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";

import Favorites from "./pages/Favorites.page";
import LandingPage from "./pages/Landing.page";
import ProfilePage from "./pages/Profile.page";
import Unauthorized from "./pages/Unauthorized.page";
import FeedBack from "./pages/FeedBack.page";
import CampaignsPage from "./pages/Campaigns.page";
function App() {
  return (  
    <HelmetProvider>
    <BrowserRouter>
      <UserSessionProvider>
      <GoogleAnalytics />
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/unauthorized"
            element={
              <PrivateRoute>
                <Unauthorized />
              </PrivateRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/candidates"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CandidatesList />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/candidate/:id"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CandidateDetails />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="campaigns/:campaignId"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CampaignsPage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Favorites />
                </AppLayout>
              </PrivateRoute>
            }
          />
          {/* Admin-Only Route */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
  path="/under-construction"
  element={
    <PrivateRoute>
      <FeedBack />
    </PrivateRoute>
  }
/>
          
          {/* Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserSessionProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

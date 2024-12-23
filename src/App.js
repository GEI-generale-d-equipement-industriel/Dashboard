import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./Layout/AppLayout";
import CandidatesList from "./components/CandidatesList";
import CandidateDetails from "./pages/CandidateDetails.page";
import FavoriteCandidates from "./components/FavoriteCandidates";
import PrivateRoute from "./components/PrivateRoute";
import { UserSessionProvider } from "./context/UserSessionContext";
import LandingPage from "./pages/Landing.page";
import ProfilePage from "./pages/Profile.page";
import Unauthorized from "./pages/Unauthorized.page";
import FeedBack from "./pages/FeedBack.page";
function App() {
  return (
    <BrowserRouter>
      <UserSessionProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/home" element={<LandingPage />} />

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
            path="/favorites"
            element={
              <PrivateRoute>
                <AppLayout>
                  <FavoriteCandidates />
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
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </UserSessionProvider>
    </BrowserRouter>
  );
}

export default App;

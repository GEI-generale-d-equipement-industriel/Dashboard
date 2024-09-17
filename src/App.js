// App.js
import React from 'react';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import AppLayout from './Layout/AppLayout';
import CandidatesList from './components/CandidatesList';
import CandidatesDetails from './components/CandidatesDetails';
import FavoriteCandidates from './components/FavoriteCandidates';
import LoginPage from './pages/Login.page';
import PrivateRoute from './components/PrivateRoute';


function App() {
  // const Navigate=useNavigation()
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute
              element={() => (
                <AppLayout>
                  <CandidatesList />
                </AppLayout>
              )}
            />
          }
        />
        <Route
          path="/candidates"
          element={
            <PrivateRoute
              element={() => (
                <AppLayout>
                  <CandidatesList />
                </AppLayout>
              )}
            />
          }
        />
        <Route
          path="/candidate/:id"
          element={
            <PrivateRoute
              element={() => (
                <AppLayout>
                  <CandidatesDetails />
                </AppLayout>
              )}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute
              element={() => (
                <AppLayout>
                  <FavoriteCandidates />
                </AppLayout>
              )}
            />
          }
        />
        {/* Redirect unknown routes to login or a 404 page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

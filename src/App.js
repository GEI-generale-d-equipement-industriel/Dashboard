import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MovieList from './components/CandidatesList';
import MovieDetails from './components/CandidatesDetails';
import Navbar from './components/NavBar';
import FavoriteCandidates from './components/FavoriteCandidates';
import LoginForm from './pages/Login.page';
import AppLayout from './Layout/AppLayout';
// const AppLayout = ({ children }) => (
//   <div className="flex flex-col min-h-screen">
//     <Navbar />
//     <div className="flex-grow p-4">
//       {children}
//     </div>
//   </div>
// );
function App() {
  return (
    <BrowserRouter>
    <AppLayout>
      <Routes>
        {/* <Route path="/" element={<LoginForm />} /> */}
        <Route path="/candidates" element={<MovieList />} />
        <Route path="/candidate/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<FavoriteCandidates />} />
      </Routes>
    </AppLayout>
  </BrowserRouter>
  );
}

export default App;

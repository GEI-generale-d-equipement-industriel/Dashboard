import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import Navbar from './components/NavBar';
import FavoriteMovies from './components/FavoriteMovies';

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>

    <Route path="/"  element={<MovieList/>} />
    <Route path="/candidate/:id" element={<MovieDetails/>}/>
    <Route path='/favorites' element={<FavoriteMovies/>}/>



    </Routes>
    </BrowserRouter>
  );
}

export default App;

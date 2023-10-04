import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/movieSlice';
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/20/solid';

const MovieDetails = () => {
  const { id } = useParams();
  const movies = useSelector((state) => state.movie.movies);
  const favorites = useSelector((state) => state.movie.favorites);
  const dispatch = useDispatch();

  const [movie, setMovie] = useState(null);

  const handleLikeToggle = (movieId) => {
    const isFavorite = favorites.includes(movieId);
    dispatch(toggleFavorite({ movieId, isFavorite }));
    const updatedFavorites = isFavorite
      ? favorites.filter((id) => id !== movieId)
      : [...favorites, movieId];
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    const movieId = parseInt(id);
    const selectedMovie = movies.find((m) => m.id === movieId);
    if (selectedMovie) {
      setMovie(selectedMovie);
    }
  }, [id, movies]);

  if (!movie) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  function extractVideoId(url) {
    const videoIdMatch = url.match(/[?&]v=([^?&]+)/);
    if (videoIdMatch) {
      return videoIdMatch[1];
    }
    return ''; // Return an empty string if no video ID is found
  }

  const videoId = extractVideoId(movie.trailerURL);

  return (
    <div className="container mx-auto px-4 py-6 ">
      <div className="max-w-screen-xl mx-auto p-8 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-4xl font-extrabold mb-6">{movie.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <img
              src={movie.posterURL}
              alt={movie.title}
              className="w-full h-full object-cover object-center transform hover:scale-105"
            />
          </div>
          <div>
            <p className="mt-2 text-2xl">Release Date: {movie.releaseDate}</p>
            <p className='text-2xl'>Genre: {movie.genre}</p>
            <h3 className="text-2xl leading-7 mt-4">Description</h3>
            <p className='text-xl'>{movie.description}</p>
            {movie.actors && movie.actors.length > 0 && (
              <>
                <h3 className="list-disc list-inside pl-4 text-2xl leading-7 mt-4">Actors</h3>
                <ul className="list-disc pl-4 text-xl">
                  {movie.actors.map((actor, index) => (
                    <li key={index}>{actor}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-4">
              <h3 className="text-2xl italic; leading-7 mt-4">Trailer</h3>
              {movie.trailerURL && (
                <div className="mt-4">
                  <iframe
                    title="Movie Trailer"
                    width="100%"
                    height="315" // Adjust the height as needed
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
            <div className="flex items-center mt-4">
              <button
                className={`bg-slate-600 text-white py-2 px-4 rounded-full hover:bg-slate-700 transform transition duration-200 ease-in-out hover:scale-110`}
                onClick={() => handleLikeToggle(movie.id)}
                style={{ pointerEvents: 'auto', margin: '1rem' }}
              >
                {favorites.includes(movie.id) ? (
                  <HandThumbDownIcon className="w-5 h-5" />
                ) : (
                  <HandThumbUpIcon className="w-5 h-5" />
                )}
              </button>
              {/* <span className="ml-2 text-xl">
                {favorites.includes(movie.id) ? 'Disliked' : 'Liked'}
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

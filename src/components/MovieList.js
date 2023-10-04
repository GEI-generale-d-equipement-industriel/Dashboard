import React,{useMemo} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/movieSlice';
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/20/solid'
import Pagination from './Pagination';

function MovieList() {
  const movies = useSelector((state) => state.movie.movies);
  const selectedGenre = useSelector((state) => state.movie.selectedGenre);
  const searchFilter = useSelector((state) => state.movie.searchFilter);
  const favorites = useSelector((state) => state.movie.favorites);
  const dispatch = useDispatch();

  const filteredMovies = movies.filter((movie) => {
    const genreMatch = !selectedGenre || movie.genre.includes(selectedGenre);
    const titleMatch = !searchFilter || movie.title.toLowerCase().includes(searchFilter.toLowerCase());
    return genreMatch && titleMatch;
  });

  const handleLikeToggle = (movieId) => {
    const isFavorite = favorites.includes(movieId);
    dispatch(toggleFavorite({ movieId, isFavorite }));
    const updatedFavorites = isFavorite
      ? favorites.filter((id) => id !== movieId)
      : [...favorites, movieId];
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
  };

  const pageSize = useSelector((state) => state.movie.pageSize);
  const currentPage = useSelector((state) => state.movie.currentPage);

  const moviesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredMovies.slice(startIndex, endIndex);
  }, [filteredMovies, currentPage, pageSize]);

  return (
    <div className="bg-gray-300">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8"
      style={{marginLeft: 'auto', marginRight: 'auto'}}>
        <h2 className="text-3xl font-bold text-center text-gray-900">Related Movies</h2>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4">
          {moviesForCurrentPage.map((movie) => (
            <div
              key={movie.title}
              className="group relative bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 transform hover:scale-105"
            >
              <div
                className="w-full h-48 overflow-hidden rounded-md bg-gray-300"
                style={{ width: '100%', height: '80%' }}
              >
                <Link to={`/movie/${movie.id}`} className="hover:text-blue-600">
                <img
                  src={movie.posterURL}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                </Link>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <Link to={`/movie/${movie.id}`} className="hover:text-blue-600">
                    {movie.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{movie.genre}</p>
              </div>
              <div className="flex justify-between mt-4">
                <p className="text-sm font-medium text-gray-700">{movie.releaseDate}</p>
                <button
                className={`bg-slate-600 text-white py-2 px-4 rounded-full hover:bg-slate-700 transform transition duration-300 ease-in-out hover:scale-110`}
                onClick={() => handleLikeToggle(movie.id)}
                style={{ pointerEvents: 'auto', marginLeft: '130px', marginRight: 'auto',marginBottom:"180px"}}
              >
                {favorites.includes(movie.id) ? (
                  <HandThumbDownIcon className="w-5 h-5" />
                ) : (
                  <HandThumbUpIcon className="w-5 h-5" />
                )}
              </button>
             
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination totalItems={filteredMovies.length} />
    </div>
  );
};

export default MovieList
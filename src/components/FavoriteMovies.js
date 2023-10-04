import { Link } from 'react-router-dom';
import React from 'react';
import { HandThumbDownIcon } from '@heroicons/react/20/solid';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/movieSlice';

const FavoriteMovies = () => {
    const favoriteMovieIds = useSelector((state) => state.movie.favorites);
    const movies = useSelector((state) => state.movie.movies);
    const dispatch = useDispatch();

    const favoriteMovies = movies.filter((movie) =>
        favoriteMovieIds.includes(movie.id)
    );

    const handleLikeToggle = (movieId) => {
        const isFavorite = favoriteMovieIds.includes(movieId);
        dispatch(toggleFavorite({ movieId, isFavorite }));
        const updatedFavorites = isFavorite
            ? favoriteMovieIds.filter((id) => id !== movieId)
            : [...favoriteMovieIds, movieId];
        localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="bg-gray-300">
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900">Related Movies</h2>

                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {favoriteMovies.map((movie) => (
                        <div
                            key={movie.title}
                            className="group relative bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
                        >
                            <div
                                className="w-full h-48 overflow-hidden rounded-md bg-gray-300"
                                style={{ width: '100%', height: '80%' }}
                            >
                                <img
                                    src={movie.posterURL}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
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
                                    className={`bg-slate-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transform transition duration-300 ease-in-out hover:scale-110`}
                                    onClick={() => handleLikeToggle(movie.id)}
                                    style={{ pointerEvents: 'auto', marginLeft: '130px', marginRight: 'auto', marginBottom: '180px' }}
                                >
                                    <HandThumbDownIcon className="w-5 h-5" /> {/* Always display the dislike icon */}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoriteMovies;

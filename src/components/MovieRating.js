import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRating } from '../store/movieSlice';
import { StarIcon } from '@heroicons/react/20/solid'; // Import the star icon

const MovieRating = ({ movieId }) => {
  const dispatch = useDispatch();
  const [rating, setLocalRating] = useState(0); // Local state to track the user's rating
  const storedRatings = useSelector((state) => state.movie.ratings);
  
  useEffect(() => {
    // Load the initial rating from local storage if available
    if (storedRatings[movieId]) {
      setLocalRating(storedRatings[movieId]);
    }
  }, [movieId, storedRatings]);

  const handleRatingChange = (newRating) => {
    // Check if the user clicks on the first star icon and they've already rated the movie
    if (newRating === 1 && rating > 0) {
      // Reset the rating to zero (unrate)
      setLocalRating(0);
      dispatch(setRating({ movieId, rating: 0 }));
    } else {
      setLocalRating(newRating);
      dispatch(setRating({ movieId, rating: newRating }));
    }
  }

  // Render stars to represent the rating
  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-6 w-6 cursor-pointer ${
            i <= rating ? 'text-yellow-400' : 'text-gray-400'
          }`}
          onClick={() => handleRatingChange(i)}
        />
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center space-x-2">
      {renderStars()}
    </div>
  );
};

export default MovieRating;

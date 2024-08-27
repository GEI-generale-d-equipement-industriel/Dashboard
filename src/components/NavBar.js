import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { filterByGenre, filterByTitle, clearFilters, restPages } from '../store/movieSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('');
    const [isGenreDropdownOpen, setGenreDropdownOpen] = useState(false);

    const selectedGenre = useSelector((state) => state.movie.selectedGenre);
    const rest=useSelector((state)=>state.movie.currentPage)
   

    const handleSearch = (e) => {
        const inputValue = e.target.value;
        
        setSearchTerm(inputValue);

        
        dispatch(filterByTitle(inputValue))
    };

    const handleGenreFilter = (genre) => {
     
        if (selectedGenre === genre) {

            dispatch(filterByGenre(""));
        } else {
            dispatch(filterByGenre(genre));
        }
        setGenreDropdownOpen(false);
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        
        setSearchTerm('');
        navigate('/');
    };
    const restFunc=()=>dispatch(restPages())
    const clearAll=()=>{
handleClearFilters()
restFunc()
    }


  return (
    <div className="bg-gray-800 text-white py-4">
    <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:flex-1">
            <Link to="/" className="text-2xl font-bold hover:text-gray-400"
                onClick={clearAll}>
                Movie App
            </Link>

            <Link
    to="/favorites"
    className="text-2xl font-bold hover:text-gray-400 rounded-md ml-4"
    style={{margin:"4rem"}}
    onClick={handleClearFilters}
  >
    Favorites
  </Link>
        </div>

        <div className="lg:space-x-2 mt-4 lg:mt-0">
            <div className="relative">
                <input
                    type="text"
                    className="bg-gray-700 text-white px-4 py-2 rounded-md"
                    placeholder="Search for a movie..."
                    value={searchTerm}
                    onChange={handleSearch}
                />

            </div>
            <div className="relative group">
                <button
                    className="bg-gray-700 px-4 py-2 rounded-md mt-4 lg:mt-0"
                    style={{ marginTop: '0.8rem' }}
                    onClick={() => setGenreDropdownOpen(!isGenreDropdownOpen)}
                >
                    Filter by Genre
                </button>
                <ul
                    className={`${isGenreDropdownOpen ? 'block' : 'hidden'
                        } absolute space-y-2 bg-white text-gray-800 rounded-md mt-2 py-2 px-4`}
                        style={{ zIndex: 10 }}
                >
                    <li
                        onClick={() => handleGenreFilter('Action')}
                        className="cursor-pointer hover:text-blue-500"
                    >
                        Action
                    </li>
                    <li
                        onClick={() => handleGenreFilter('Comedy')}
                        className="cursor-pointer hover:text-blue-500"
                    >
                        Comedy
                    </li>
              <li
                onClick={() => handleGenreFilter('Science Fiction')}
                className="cursor-pointer hover:text-blue-500"
              >
                Science Fiction
              </li>
              <li
                onClick={() => handleGenreFilter('Superhero')}
                className="cursor-pointer hover:text-blue-500"
              >
                Superhero
              </li>
              <li
                onClick={() => handleGenreFilter('Horror')}
                className="cursor-pointer hover:text-blue-500"
              >
                Horror
              </li>
              <li
                onClick={() => handleGenreFilter('Adventure')}
                className="cursor-pointer hover:text-blue-500"
              >
                Adventure
              </li>
             
            </ul>
          </div>
          {selectedGenre && (
                        <button
                            className="bg-red-600 px-4 py-2 rounded-md mt-4 lg:mt-0"
                            style={{ marginTop: '0.8rem' }}
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </button>
                    )}
                    
                </div>
            </div>
        </div>
  );
};

export default Navbar;
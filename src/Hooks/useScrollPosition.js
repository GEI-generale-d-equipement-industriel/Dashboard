import { useEffect } from 'react';

/**
 * Custom hook to save and restore scroll position.
 * @param {Array} dependencies - Optional dependencies to trigger restoration on change.
 */
const useScrollPosition = (dependencies = []) => {
  useEffect(() => {
    // Restore scroll position on component mount
    const scrollY = localStorage.getItem('scrollPosition');
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY, 10));
    }

    // Save the scroll position to localStorage on scroll
    const handleScroll = () => {
      localStorage.setItem('scrollPosition', window.scrollY);
    };

    // Debounce the scroll event for better performance
    const debounce = (func, delay) => {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
      };
    };

    const debouncedHandleScroll = debounce(handleScroll, 100);

    // Add scroll event listener
    window.addEventListener('scroll', debouncedHandleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, dependencies); // Re-run effect if dependencies change
};

export default useScrollPosition;

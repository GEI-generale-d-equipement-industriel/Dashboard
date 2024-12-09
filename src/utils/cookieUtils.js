// src/utils/cookieUtils.js

/**
 * Sets a cookie.
 * @param {string} name - Cookie name.
 * @param {string} value - Cookie value.
 * @param {number} days - Number of days until the cookie expires.
 */
export const setCookie = (name, value, days = 1) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };
  
  /**
   * Retrieves a cookie value by name.
   * @param {string} name - Cookie name.
   * @returns {string|null} - Cookie value or null if not found.
   */
  export const getCookie = (name) => {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      
      
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, null);
  };
  
  /**
   * Deletes a cookie by name.
   * @param {string} name - Cookie name.
   */
  export const deleteCookie = (name) => {
    setCookie(name, '', -1);
  };
  
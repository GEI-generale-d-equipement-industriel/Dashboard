// src/context/useBroadcastChannel.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthData, removeAuthData } from '../store/authSlice';
import { getCookie } from '../utils/cookieUtils';

const useBroadcastChannel = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (event) => {
      const { action, token } = event.data;
      

      if (action === 'LOGIN' && token) {
        const id = getCookie('userId');
        
        
        if (id) {
          // Update sessionStorage
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('id', id);
          // Update Redux store
          dispatch(setAuthData({ token, id }));
        }
      } else if (action === 'LOGOUT') {
        // Clear sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id');
        // Update Redux store
        dispatch(removeAuthData());
      }
    };

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('auth-channel');
      channel.onmessage = handleMessage;

      return () => {
        channel.close();
      };
    } else {
      // Fallback using localStorage
      const handleStorage = (event) => {
        if (event.key === 'auth-event') {
          const { action, token } = JSON.parse(event.newValue);
          handleMessage({ data: { action, token } });
        }
      };

      window.addEventListener('storage', handleStorage);

      return () => {
        window.removeEventListener('storage', handleStorage);
      };
    }
  }, [dispatch]);
};

export default useBroadcastChannel;

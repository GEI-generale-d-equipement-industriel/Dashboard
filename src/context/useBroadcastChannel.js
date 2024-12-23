// src/context/useBroadcastChannel.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthData, removeAuthData } from '../store/authSlice';
import { getCookie } from '../utils/cookieUtils';
import { decodeJWT } from '../utils/jwtUtils';

const useBroadcastChannel = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (event) => {
      const { action, token } = event.data;
      

      if (action === 'LOGIN' && token) {
        const id = getCookie('userId');
        
        
        if (id) {
          const decodedToken = decodeJWT(token);
          const role = decodedToken?.role || 'user';
          // Update sessionStorage
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('id', id);
          sessionStorage.setItem('role', role);

          // Update Redux store
          dispatch(setAuthData({ token, id, role }));
        }
      } else if (action === 'LOGOUT') {
        // Clear sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('role');
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

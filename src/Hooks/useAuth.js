// hooks/useAuth.js
import { useSelector } from 'react-redux';

const useAuth = () => {
  const token = useSelector((state) => state.auth.token);
  const authInitialized = useSelector((state) => state.auth.authInitialized);
  
  return { isAuthenticated: !!token, authInitialized };
};

export default useAuth;

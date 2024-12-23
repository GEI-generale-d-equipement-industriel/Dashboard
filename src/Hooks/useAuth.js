// hooks/useAuth.js
import { useSelector } from 'react-redux';

const useAuth = () => {
  const token = useSelector((state) => state.auth.token);
  const authInitialized = useSelector((state) => state.auth.authInitialized);
  const role = useSelector((state) => state.auth.role); // Access role from Redux state
 

  return { isAuthenticated: !!token, authInitialized, role };
};

export default useAuth;

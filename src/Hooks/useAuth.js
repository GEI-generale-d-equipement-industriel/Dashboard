// hooks/useAuth.js
import { useSelector } from 'react-redux';

const useAuth = () => {
  const token = useSelector((state) => state.auth.token);
  return { isAuthenticated: !!token };
};

export default useAuth;

import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for auth token

    if (!token) {
      navigate('/login'); // Redirect to login if no token
    } else {
      setIsAuth(true);
    }
  }, [navigate]);

  if (!isAuth) return null; // Prevent rendering until auth check is complete

  return <>{children}</>;
};

export default AuthGuard;

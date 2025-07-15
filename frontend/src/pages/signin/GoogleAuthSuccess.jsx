import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Helper to decode JWT
const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)); 
  } catch (err) {
    console.error('[JWT Decode] Failed to decode token:', err);
    return null;
  }
};

const GoogleAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    

    if (token) {
      try {
        localStorage.setItem('token', token);

        const decoded = decodeJWT(token);
        

        if (decoded?.id) {
          localStorage.setItem('userId', decoded.id);
          
        } else {
          console.warn('[GoogleAuthSuccess] No userId found in token');
        }

        login(); 
        navigate('/');
      } catch (err) {
       
        alert('Login failed due to an error.');
        navigate('/signin');
      }
    } else {
      alert('Login failed.');
      navigate('/signin');
    }
  }, []);

  return <p className="text-center mt-10 text-lg">Logging in with Google...</p>;
};

export default GoogleAuthSuccess;

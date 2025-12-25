import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await axios.get('http://localhost:4000/auth/me', {
            headers: {
              Authorization: `Bearer ${savedToken}`
            }
          });
          setUser(response.data);
          setToken(savedToken);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        email,
        password
      });

      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);

      Swal.fire({ 
        icon: 'success', 
        title: 'Login Successful',
        timer: 1500
      });
    } catch (error) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Login Failed',
        text: 'Please check your credentials'
      });
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    loading
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};
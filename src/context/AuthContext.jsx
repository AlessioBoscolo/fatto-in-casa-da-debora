import { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const AUTO_LOGOUT_MINUTES = Number(process.env.REACT_APP_AUTO_LOGOUT_MINUTES ?? 30);
const AUTO_LOGOUT_MS = AUTO_LOGOUT_MINUTES * 60 * 1000;

const getStoredUser = () => {
  const savedUser = localStorage.getItem('user');
  if (!savedUser) {
    return null;
  }

  const storedAt = localStorage.getItem('userSessionCreatedAt');
  if (!storedAt) {
    return JSON.parse(savedUser);
  }

  const elapsed = Date.now() - Number(storedAt);
  if (Number.isNaN(elapsed) || elapsed >= AUTO_LOGOUT_MS) {
    localStorage.removeItem('user');
    localStorage.removeItem('userSessionCreatedAt');
    return null;
  }

  return JSON.parse(savedUser);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userSessionCreatedAt', Date.now().toString());
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userSessionCreatedAt');
  }, []);

  /*
  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const storedAt = localStorage.getItem('userSessionCreatedAt');
    const elapsed = storedAt ? Date.now() - Number(storedAt) : 0;
    const remainingTime = AUTO_LOGOUT_MS - elapsed;
    console.log(remainingTime);
    

    if (remainingTime <= 0 || Number.isNaN(remainingTime)) {
      logout();
      return undefined;
    }

    const timerId = setTimeout(logout, remainingTime);

    return () => clearTimeout(timerId);
  }, [user, logout]);

  */

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
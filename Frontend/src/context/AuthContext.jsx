import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const persist = (u, t) => {
    if (u && t) {
      localStorage.setItem('user', JSON.stringify(u));
      localStorage.setItem('token', t);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      persist(data.user, data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data.user);
      setToken(data.token);
      persist(data.user, data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setBookmarks([]);
    persist(null, null);
  };

  const refreshMe = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      setBookmarks(data.bookmarks || []);
    } catch {
      logout();
    }
  }, [token]);

  // Toggle bookmark and update local state
  const toggleBookmark = async (storyId) => {
    const { data } = await api.post(`/stories/${storyId}/bookmark`);
    setBookmarks(data.bookmarks);
    return data.bookmarked;
  };

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const value = {
    user,
    token,
    bookmarks,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    toggleBookmark,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

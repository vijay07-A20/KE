import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cds_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default logged in user for immediate clinical demonstration
    return {
      id: 1,
      username: 'dr.sarah',
      fullName: 'Dr. Sarah Connor, MD',
      email: 'sarah.connor@hospital.org',
      role: 'Doctor'
    };
  });

  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await api.login(username, password);
      localStorage.setItem('cds_token', data.access_token);
      localStorage.setItem('cds_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cds_token');
    localStorage.removeItem('cds_user');
    setUser(null);
  };

  const switchRole = async (targetRole) => {
    try {
      const data = await api.quickSwitchRole(targetRole);
      localStorage.setItem('cds_token', data.access_token);
      localStorage.setItem('cds_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (e) {
      console.error("Role switch failed, setting client-side:", e);
      const fallbackUser = {
        ...user,
        role: targetRole,
        fullName: targetRole === 'Pharmacist' ? 'Marcus Vance, PharmD' : targetRole === 'Admin' ? 'System Administrator' : 'Dr. Sarah Connor, MD'
      };
      setUser(fallbackUser);
      localStorage.setItem('cds_user', JSON.stringify(fallbackUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

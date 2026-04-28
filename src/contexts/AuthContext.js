'use client';
// src/contexts/AuthContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      let message = 'Нэвтрэлт амжилтгүй боллоо';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password')
        message = 'И-мэйл эсвэл нууц үг буруу байна';
      else if (error.code === 'auth/user-not-found')
        message = 'Хэрэглэгч олдсонгүй';
      else if (error.code === 'auth/too-many-requests')
        message = 'Хэт олон удаа оролдлоо. Хэсэг хүлээгээд дахин оролдоно уу';
      else if (error.code === 'auth/invalid-email')
        message = 'И-мэйл буруу байна';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = { user, loading, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

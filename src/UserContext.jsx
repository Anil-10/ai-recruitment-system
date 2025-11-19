import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load existing session on refresh
  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initSession();

    // Listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }

    setLoading(false);
    return { success: true };
  };

  const register = async (email, password, type) => {
    setLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { type } }, // store recruiter vs jobseeker role
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }

    setLoading(false);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        logout,
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};








// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useMemo,
// } from 'react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
// const TOKEN_STORAGE_KEY = 'talentmatch_token';
// const USER_STORAGE_KEY = 'talentmatch_user';

// const UserContext = createContext();

// const persistSessionStorage = (user, token) => {
//   if (typeof window === 'undefined') {
//     return;
//   }
//   if (user && token) {
//     localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
//     localStorage.setItem(TOKEN_STORAGE_KEY, token);
//   } else {
//     localStorage.removeItem(USER_STORAGE_KEY);
//     localStorage.removeItem(TOKEN_STORAGE_KEY);
//   }
// };

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authError, setAuthError] = useState(null);

//   const persistSession = (nextUser, nextToken) => {
//     setUser(nextUser);
//     setToken(nextToken);
//     persistSessionStorage(nextUser, nextToken);
//   };

//   const loadSession = async (savedToken) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${savedToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Session expired');
//       }

//       const data = await response.json();
//       if (data?.user) {
//         persistSession(data.user, savedToken);
//       } else {
//         persistSession(null, null);
//       }
//     } catch {
//       persistSession(null, null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (typeof window === 'undefined') {
//       setLoading(false);
//       return;
//     }
//     const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
//     const savedUser = localStorage.getItem(USER_STORAGE_KEY);

//     if (savedToken && savedUser) {
//       setLoading(true);
//       loadSession(savedToken);
//     } else {
//       persistSession(null, null);
//       setLoading(false);
//     }
//   }, []);

//   const login = async ({ email, password }) => {
//     setLoading(true);
//     setAuthError(null);

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       if (!response.ok || !data?.token) {
//         throw new Error(data?.error || 'Invalid credentials');
//       }

//       persistSession(data.user, data.token);
//       return { success: true, user: data.user };
//     } catch (error) {
//       persistSession(null, null);
//       setAuthError(error.message);
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (payload) => {
//     setLoading(true);
//     setAuthError(null);

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (!response.ok || !data?.token) {
//         throw new Error(data?.error || 'Unable to register');
//       }

//       persistSession(data.user, data.token);
//       return { success: true, user: data.user };
//     } catch (error) {
//       persistSession(null, null);
//       setAuthError(error.message);
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     persistSession(null, null);
//   };

//   const value = useMemo(
//     () => ({
//       user,
//       token,
//       loading,
//       authError,
//       login,
//       register,
//       logout,
//     }),
//     [user, token, loading, authError],
//   );

//   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// }

// export function useUser() {
//   return useContext(UserContext);
// }

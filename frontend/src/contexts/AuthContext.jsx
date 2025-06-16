import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import apiService from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, displayName) {
    try {
      // Create user in Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, {
        displayName: displayName
      });

      // Get Firebase token and verify with backend
      const idToken = await result.user.getIdToken();
      const backendResponse = await apiService.verifyToken(idToken);
      
      setBackendUser(backendResponse.user);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Login function
  async function login(email, password) {
    try {
      // Sign in with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Get Firebase token and verify with backend
      const idToken = await result.user.getIdToken();
      const backendResponse = await apiService.verifyToken(idToken);
      
      setBackendUser(backendResponse.user);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Logout function
  async function logout() {
    try {
      await signOut(auth);
      setBackendUser(null);
    } catch (error) {
      throw error;
    }
  }

  // Get authentication headers for API calls
  async function getAuthHeaders() {
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        return {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
      } catch (error) {
        console.error('Error getting auth token:', error);
        return { 'Content-Type': 'application/json' };
      }
    }
    return { 'Content-Type': 'application/json' };
  }

  // Sync user with backend when Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Verify token with backend and get user data
          const idToken = await user.getIdToken();
          const backendResponse = await apiService.verifyToken(idToken);
          setBackendUser(backendResponse.user);
        } catch (error) {
          console.error('Error syncing with backend:', error);
          setBackendUser(null);
        }
      } else {
        setBackendUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,        // Firebase user object
    backendUser,        // Your backend user object with challenge data
    signup,
    login,
    logout,
    getAuthHeaders,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

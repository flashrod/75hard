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

  // Sign up function with better error handling
  async function signup(email, password, displayName) {
    try {
      console.log('🔄 Creating Firebase user...');
      
      // Create user in Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase user created successfully');
      
      // Update display name
      await updateProfile(result.user, {
        displayName: displayName
      });
      console.log('✅ Display name updated');

      // Get Firebase token and verify with backend
      const idToken = await result.user.getIdToken();
      console.log('🔄 Verifying token with backend...');
      
      const backendResponse = await apiService.verifyToken(idToken);
      console.log('✅ Backend user created/verified');
      
      setBackendUser(backendResponse.user);
      return result;
    } catch (error) {
      console.error('❌ Signup error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please contact support.');
      } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      
      throw error;
    }
  }

  // Login function with better error handling
  async function login(email, password) {
    try {
      console.log('🔄 Signing in with Firebase...');
      
      // Sign in with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase login successful');
      
      // Get Firebase token and verify with backend
      const idToken = await result.user.getIdToken();
      console.log('🔄 Verifying token with backend...');
      
      const backendResponse = await apiService.verifyToken(idToken);
      console.log('✅ Backend verification successful');
      
      setBackendUser(backendResponse.user);
      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please contact support.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      }
      
      throw error;
    }
  }

  // Logout function
  async function logout() {
    try {
      console.log('🔄 Logging out...');
      await signOut(auth);
      setBackendUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
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
      console.log('🔄 Auth state changed:', user ? 'User logged in' : 'User logged out');
      setCurrentUser(user);
      
      if (user) {
        try {
          // Verify token with backend and get user data
          const idToken = await user.getIdToken();
          const backendResponse = await apiService.verifyToken(idToken);
          setBackendUser(backendResponse.user);
          console.log('✅ Backend sync successful');
        } catch (error) {
          console.error('❌ Error syncing with backend:', error);
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

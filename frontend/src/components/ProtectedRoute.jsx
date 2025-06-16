import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-sky flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected component
  return children;
}

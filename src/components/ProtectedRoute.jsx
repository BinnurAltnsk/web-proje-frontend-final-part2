import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Yükleniyor...</div>;

  if (!user) {
    // Giriş yapmamışsa Login sayfasına at
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
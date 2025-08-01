import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  return token ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

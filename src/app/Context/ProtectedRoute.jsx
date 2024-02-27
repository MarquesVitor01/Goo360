import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './app/Context/auth.jsx';
function ProtectedRoute({ element, ...rest }) {
  const { logado } = useContext(AuthContext);
  return logado ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/app" />
  );  
}
export default ProtectedRoute;
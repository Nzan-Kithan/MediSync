import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element, allowedPositions }) => {
    const { isAuthenticated, position } = useAuth();

    // Check if user is authenticated and if their position is allowed
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedPositions && !allowedPositions.includes(position)) {
        return <Navigate to="/" replace />; // Redirect to unauthorized page or any other page
    }

    return element;
};

export default ProtectedRoute;

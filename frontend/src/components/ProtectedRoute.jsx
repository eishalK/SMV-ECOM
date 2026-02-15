import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    // If the user is not logged in then redirect to home
    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // logged in but wrong role then redirect to home

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // everything is fine then render the dashboard
    return children;
};

export default ProtectedRoute;
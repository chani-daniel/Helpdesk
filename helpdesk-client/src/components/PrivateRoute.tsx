import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/context';
import type { ReactNode } from 'react';

type PrivateRouteProps = {
    children: ReactNode;
    allowedRoles?: ('customer' | 'agent' | 'admin')[];
};

function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute;
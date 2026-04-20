import { Navigate } from 'react-router-dom';

// Simple protected route using JWT stored in localStorage by the backend OAuth flow.
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

export default ProtectedRoute;
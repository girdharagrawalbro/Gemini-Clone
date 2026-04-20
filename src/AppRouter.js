import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import SignInPage from './components/SignIn';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/" element={<App />} />
                <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
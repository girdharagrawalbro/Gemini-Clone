import React from 'react';

const SignInPage = () => {
  const handleGoogleSignIn = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'https://gemini-clone-yp44.onrender.com/api';
    // Redirect to backend OAuth start endpoint
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome to Gemini</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to continue to your conversations</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={handleGoogleSignIn}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
            aria-label="Continue with Google"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M21.35 11.1h-9.17v2.92h5.26c-.23 1.32-1.35 3.86-5.26 3.86-3.16 0-5.73-2.61-5.73-5.83s2.57-5.83 5.73-5.83c1.8 0 3.01.77 3.7 1.44l2.53-2.43C17.4 3.36 15.48 2.5 12.99 2.5 7.99 2.5 4 6.54 4 11.26s3.99 8.76 8.99 8.76c5.2 0 8.66-3.66 8.36-8.92z" fill="#4285F4"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-4 text-xs text-gray-500">By continuing you agree to our terms and privacy.</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
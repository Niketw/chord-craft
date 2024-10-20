import React from "react";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-green-500">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-2xl mb-2">Not Found</h2>
                <p className="mb-4">Oops! The page you're looking for doesn't exist.</p>
                <a href="/" className="text-green-500 underline hover:text-green-400">
                    Go back to Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;
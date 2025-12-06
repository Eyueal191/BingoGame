import React from "react";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4">
      <h1 className="text-9xl font-extrabold tracking-widest">404</h1>
      <p className="text-2xl md:text-3xl mt-4">
        Oops! Page not found.
      </p>
      <p className="mt-2 text-lg md:text-xl text-purple-200">
        The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-md hover:bg-purple-100 transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}

export default NotFoundPage;

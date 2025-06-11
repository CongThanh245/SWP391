import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Authorization = ({ errorType = "401" }) => {
  const location = useLocation();

  useEffect(() => {
    const errorMessage = errorType === "401" 
      ? "401 Error: User attempted to access protected route without authentication:"
      : "403 Error: User attempted to access forbidden route:";
    
    console.error(errorMessage, location.pathname);
  }, [location.pathname, errorType]);

  const getErrorContent = () => {
    if (errorType === "401") {
      return {
        code: "401",
        title: "Authentication Required",
        message: "You need to log in to access this page",
        actionText: "Go to Login",
        actionHref: "/login"
      };
    } else {
      return {
        code: "403",
        title: "Access Forbidden",
        message: "You don't have permission to access this page",
        actionText: "Return to Home",
        actionHref: "/"
      };
    }
  };

  const { code, title, message, actionText, actionHref } = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{code}</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-xl text-gray-600 mb-6">{message}</p>
        <div className="space-y-2">
          <a 
            href={actionHref} 
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
          >
            {actionText}
          </a>
          <br />
          <a 
            href="/" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
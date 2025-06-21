import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastProvider, ToastViewport } from "@components/ui/toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider>
      <ToastProvider>
        <App />
        <ToastViewport />
      </ToastProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

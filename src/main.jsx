import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastProvider, ToastViewport } from '@radix-ui/react-toast';
import { Toaster } from './components/ui/toaster.js';
import { ThemeProvider } from './themes/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
          <ToastViewport />
          <Toaster />
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
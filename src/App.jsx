// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index.jsx";
import "./App.css";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastViewport />
    </ToastProvider>
  );
}

export default App;

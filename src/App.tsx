import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRouter from "./routes/AppRouter";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />  
        <main className="flex-grow">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;

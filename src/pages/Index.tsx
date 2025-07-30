import { useState } from "react";
import { FPLDashboard } from "@/components/FPLDashboard";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication state for demo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // For demo purposes, show auth form first, then dashboard after "login"
  if (!isAuthenticated && !user) {
    return (
      <div>
        <AuthForm />
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setIsAuthenticated(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg hover:shadow-glow transition-all"
          >
            Skip Auth (Demo)
          </button>
        </div>
      </div>
    );
  }

  return <FPLDashboard />;
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;

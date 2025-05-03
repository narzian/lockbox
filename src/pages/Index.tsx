
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after showing splash for a moment
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000); // Increased time to 2 seconds to show the animation

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-pulse">
        <div className="flex justify-center mb-4">
          <div className="bg-vault-softPurple p-4 rounded-full">
            <Lock className="h-8 w-8 text-vault-black animate-spin-slow" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-vault-black">LockBox</h1>
        <p className="mt-2 text-muted-foreground">Secure Password Manager</p>
      </div>
    </div>
  );
};

export default Index;

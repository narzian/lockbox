
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after showing splash for a moment
    const timer = setTimeout(() => {
      navigate("/");
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-vault-softPurple p-4 rounded-full">
            <Lock className="h-8 w-8 text-vault-purple" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Vault Keeper</h1>
        <p className="mt-2 text-muted-foreground">Secure Password Manager</p>
      </div>
    </div>
  );
};

export default Index;

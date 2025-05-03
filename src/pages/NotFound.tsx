
import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Log the error
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Show a toast with the error
    toast.error("Page not found", {
      description: `The requested page "${location.pathname}" could not be found.`
    });
  }, [location.pathname]);

  // Automatically redirect to dashboard after a delay
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000); // Reduced to 3 seconds for better UX

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col space-y-3">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="tracking-normal">Go Back</span>
          </Button>
          <Link to="/dashboard">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Automatically redirecting to dashboard...
        </p>
      </div>
    </div>
  );
};

export default NotFound;

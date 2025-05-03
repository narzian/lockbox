
import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Log the error
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Automatically redirect to dashboard after a delay
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col space-y-3">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="font-sans tracking-normal">Go Back</span>
          </Button>
          <Link to="/dashboard">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          You will be automatically redirected to the dashboard in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default NotFound;

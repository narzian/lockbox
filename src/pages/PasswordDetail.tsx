import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Copy, Trash, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getCategoryColor } from '@/lib/utils';

// Mock data - in a real app this would come from a secure storage
const mockPasswords = [
  { 
    id: "1", 
    title: "Facebook", 
    username: "user@example.com", 
    password: "securePass123!",
    url: "https://facebook.com",
    category: "Social",
    lastUsed: "2 days ago",
    notes: "Personal account",
    icon: "👤"
  },
  // Other passwords from the Dashboard's mock data would be here
];

const PasswordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Find the password by ID
  const password = mockPasswords.find(p => p.id === id);
  
  if (!password) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-xl font-semibold mb-2">Password Not Found</h2>
        <p className="text-muted-foreground mb-4">The password you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }
  
  const categoryColor = getCategoryColor(password.category);
  
  const handleCopyUsername = () => {
    navigator.clipboard.writeText(password.username);
    toast.success("Username copied to clipboard");
  };
  
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password.password);
    toast.success("Password copied to clipboard");
  };
  
  const handleEdit = () => {
    // In a real app, navigate to edit page
    toast.info("Edit functionality would open here");
  };
  
  const handleDelete = () => {
    // In a real app, show confirmation dialog and delete
    toast.info("Delete confirmation would show here");
  };

  return (
    <div className="animate-fade-in">
      {/* Back button and title */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-muted-foreground mr-2"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold">Password Details</h1>
      </div>
      
      {/* Password card */}
      <Card className="p-5 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-vault-softPurple flex items-center justify-center mr-3">
            <span className="text-2xl">{password.icon}</span>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">{password.title}</h2>
            <div 
              className="category-pill inline-block" 
              style={{backgroundColor: `${categoryColor}20`, color: categoryColor}}
            >
              {password.category}
            </div>
          </div>
        </div>
        
        {password.url && (
          <a 
            href={password.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-vault-purple hover:underline block mb-4"
          >
            {password.url}
          </a>
        )}
        
        <Separator className="my-4" />
        
        {/* Credentials */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <div className="flex items-center mt-1">
              <div className="flex-grow border rounded-lg p-2 bg-secondary">
                {password.username}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCopyUsername}
                className="ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <div className="flex items-center mt-1">
              <div className="flex-grow border rounded-lg p-2 bg-secondary">
                {showPassword ? password.password : '••••••••••••'}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCopyPassword}
                className="ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {password.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Notes</label>
              <div className="border rounded-lg p-2 bg-secondary mt-1">
                {password.notes}
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Action buttons */}
      <div className="flex space-x-2">
        <Button 
          className="flex-1" 
          variant="outline" 
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
        <Button 
          className="flex-1" 
          variant="destructive" 
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4 mr-2" /> Delete
        </Button>
      </div>
    </div>
  );
};

export default PasswordDetail;

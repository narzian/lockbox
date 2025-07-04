
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Copy, Trash, Edit, ExternalLink, Clock, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { knownServices, openServiceLink } from '@/lib/serviceDetection';

const PasswordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPassword, setEditedPassword] = useState<any>(null);
  
  // Load the password from localStorage
  useEffect(() => {
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      const passwords = JSON.parse(storedPasswords);
      const found = passwords.find((p: any) => p.id === id);
      if (found) {
        setPassword(found);
        setEditedPassword(JSON.parse(JSON.stringify(found))); // Deep copy for editing
      }
    }
  }, [id]);
  
  if (!password) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-xl font-semibold mb-2">Password Not Found</h2>
        <p className="text-muted-foreground mb-4">The password you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }
  
  const handleCopyUsername = () => {
    navigator.clipboard.writeText(password.username);
    toast.success("Username copied to clipboard");
  };
  
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password.password);
    toast.success("Password copied to clipboard");
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setEditedPassword(JSON.parse(JSON.stringify(password)));
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    // Update the password in localStorage
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      const passwords = JSON.parse(storedPasswords);
      const updatedPasswords = passwords.map((p: any) => 
        p.id === id ? {...editedPassword, updatedAt: new Date().toISOString()} : p
      );
      localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
      
      // Update the current password state
      setPassword({...editedPassword, updatedAt: new Date().toISOString()});
      setIsEditing(false);
      toast.success("Password updated successfully");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedPassword({...editedPassword, [field]: value});
  };
  
  const handleDelete = () => {
    // Get all passwords
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      const passwords = JSON.parse(storedPasswords);
      // Filter out the current password
      const updatedPasswords = passwords.filter((p: any) => p.id !== id);
      // Save back to localStorage
      localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
    }
    
    toast.success(`Password for ${password.title} deleted`);
    navigate('/dashboard');
  };
  
  const handleOpenLink = () => {
    // Check if this is a known service
    const service = Object.values(knownServices).find(s => 
      s.name.toLowerCase() === password.title.toLowerCase()
    );
    
    if (service) {
      openServiceLink(service);
    } else if (password.url) {
      window.open(password.url, '_blank');
    }
  };

  // Format the dates to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Detect if the service has a deep link or external URL
  const hasLink = Boolean(password.url) || Object.values(knownServices).some(
    s => s.name.toLowerCase() === password.title.toLowerCase()
  );

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
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-3">
            <span className="text-2xl">{password.icon}</span>
          </div>
          
          <div className="flex-grow">
            {isEditing ? (
              <Input 
                value={editedPassword.title} 
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mb-1"
              />
            ) : (
              <h2 className="text-xl font-semibold">{password.title}</h2>
            )}
            <Badge className="bg-secondary text-foreground">
              {password.category}
            </Badge>
          </div>
          
          {hasLink && !isEditing && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleOpenLink}
              title="Open application or website"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <div className="mb-4">
            <label className="text-sm font-medium text-muted-foreground">URL</label>
            <Input 
              value={editedPassword.url || ''} 
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        ) : (
          password.url && (
            <a 
              href={password.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline block mb-4"
            >
              {password.url}
            </a>
          )
        )}
        
        <Separator className="my-4" />
        
        {/* Credentials */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <div className="flex items-center mt-1">
              {isEditing ? (
                <Input 
                  value={editedPassword.username} 
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="flex-grow"
                />
              ) : (
                <div className="flex-grow border rounded-lg p-2 bg-secondary">
                  {password.username}
                </div>
              )}
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCopyUsername}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <div className="flex items-center mt-1">
              {isEditing ? (
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  value={editedPassword.password} 
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="flex-grow"
                />
              ) : (
                <div className="flex-grow border rounded-lg p-2 bg-secondary">
                  {showPassword ? password.password : '••••••••••••'}
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCopyPassword}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Notes</label>
            {isEditing ? (
              <Input 
                value={editedPassword.notes || ''} 
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add notes (optional)"
              />
            ) : (
              password.notes && (
                <div className="border rounded-lg p-2 bg-secondary mt-1">
                  {password.notes}
                </div>
              )
            )}
          </div>
          
          {/* Timestamp information */}
          <div className="pt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Created: {formatDate(password.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Last updated: {formatDate(password.updatedAt)}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Action buttons */}
      {isEditing ? (
        <div className="flex space-x-2">
          <Button 
            className="flex-1" 
            variant="outline" 
            onClick={handleCancelEdit}
          >
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button 
            className="flex-1" 
            variant="default" 
            onClick={handleSaveEdit}
          >
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
        </div>
      ) : (
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
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the password for {password.title}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PasswordDetail;

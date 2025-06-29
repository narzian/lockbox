
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, RefreshCw, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { checkPasswordStrength, generatePassword } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading';
import { ErrorDisplay } from '@/components/ErrorDisplay';

const AddPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    category: '',
    notes: '',
  });
  const [categories, setCategories] = useState<string[]>([
    "Social", "Finance", "Work", "Shopping", "Entertainment", "Education", "Government"
  ]);
  
  // Load categories from localStorage
  useEffect(() => {
    try {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);
  
  const passwordStrength = checkPasswordStrength(formData.password);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
    if (error) setError(null);
  };
  
  const handleGeneratePassword = async () => {
    setIsGenerating(true);
    try {
      // Simulate brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 300));
      const newPassword = generatePassword();
      setFormData(prev => ({ ...prev, password: newPassword }));
      toast.success("Strong password generated");
    } catch (err) {
      toast.error("Failed to generate password");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate required fields
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.username.trim()) {
      setError("Username/Email is required");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new password object
      const newPassword = {
        id: crypto.randomUUID(),
        title: formData.title.trim(),
        username: formData.username.trim(),
        password: formData.password,
        url: formData.url.trim() || '',
        category: formData.category,
        notes: formData.notes.trim() || '',
        lastUsed: "Just now",
        icon: "🔒",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Get existing passwords from localStorage
      const storedPasswords = localStorage.getItem('passwords');
      const existingPasswords = storedPasswords ? JSON.parse(storedPasswords) : [];
      
      // Add the new password
      const updatedPasswords = [...existingPasswords, newPassword];
      
      // Save to localStorage
      localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
      
      toast.success("Password saved successfully");
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save password:', err);
      setError("Failed to save password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-2 p-2"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Password</h1>
      </div>

      {error && (
        <ErrorDisplay
          message={error}
          onDismiss={() => setError(null)}
          className="mb-6"
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Facebook, Gmail, Bank"
              value={formData.title}
              onChange={handleInputChange}
              required
              aria-describedby="title-help"
              className="w-full"
            />
            <p id="title-help" className="text-xs text-muted-foreground">
              Enter a descriptive name for this password
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger aria-describedby="category-help">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p id="category-help" className="text-xs text-muted-foreground">
              Choose the most appropriate category
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Username/Email <span className="text-destructive" aria-label="required">*</span>
          </Label>
          <Input
            id="username"
            name="username"
            type="email"
            placeholder="your.email@example.com"
            value={formData.username}
            onChange={handleInputChange}
            required
            aria-describedby="username-help"
          />
          <p id="username-help" className="text-xs text-muted-foreground">
            Enter your username or email address
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleGeneratePassword}
              disabled={isGenerating}
              className="h-6 text-xs text-muted-foreground hover:text-primary"
              aria-label="Generate secure password"
            >
              {isGenerating ? (
                <LoadingSpinner size="sm" className="mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Generate
            </Button>
          </div>
          
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter secure password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="pr-12"
              aria-describedby="password-help password-strength"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-10 w-10 hover:bg-transparent"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {formData.password && (
            <div className="mt-2" id="password-strength">
              <div className="flex items-center gap-2 mb-1" role="status" aria-live="polite">
                <div 
                  className="h-1 flex-grow rounded-full bg-gray-200"
                  style={{
                    background: `linear-gradient(to right, ${passwordStrength.color} ${(passwordStrength.score + 1) * 20}%, #e5e7eb ${(passwordStrength.score + 1) * 20}%)`
                  }}
                  aria-hidden="true"
                />
                <span 
                  className="text-xs font-medium"
                  style={{ color: passwordStrength.color }}
                  aria-label={`Password strength: ${passwordStrength.label}`}
                >
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          )}
          <p id="password-help" className="text-xs text-muted-foreground">
            Use a strong, unique password or generate one automatically
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="url" className="text-sm font-medium">Website URL (optional)</Label>
          <Input
            id="url"
            name="url"
            type="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={handleInputChange}
            aria-describedby="url-help"
          />
          <p id="url-help" className="text-xs text-muted-foreground">
            Add the website URL for quick access
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Add any additional information here"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            aria-describedby="notes-help"
          />
          <p id="notes-help" className="text-xs text-muted-foreground">
            Add any additional information or security questions
          </p>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-vault-purple hover:bg-vault-darkPurple"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Password
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPassword;

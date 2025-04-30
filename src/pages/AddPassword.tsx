
import React, { useState } from 'react';
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
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { checkPasswordStrength, generatePassword } from '@/lib/utils';

const categories = [
  "Social", "Finance", "Work", "Shopping", "Entertainment", "Education", "Government"
];

const AddPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    category: '',
    notes: '',
  });
  
  const passwordStrength = checkPasswordStrength(formData.password);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData(prev => ({ ...prev, password: newPassword }));
    toast.success("Password generated");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.username || !formData.password || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // In a real app, save to secure storage
    console.log("Saving password:", formData);
    toast.success("Password saved successfully");
    navigate('/');
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-muted-foreground mr-2"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold">Add New Password</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Facebook, Gmail, Bank"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
            required
          >
            <SelectTrigger>
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username/Email <span className="text-destructive">*</span></Label>
          <Input
            id="username"
            name="username"
            placeholder="your.email@example.com"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleGeneratePassword}
              className="h-6 text-xs text-muted-foreground flex gap-1 items-center"
            >
              <RefreshCw className="h-3 w-3" /> Generate
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
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-10 w-10"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {formData.password && (
            <div className="mt-1">
              <div className="flex items-center gap-1">
                <div 
                  className="h-1 flex-grow rounded-full bg-gray-200"
                  style={{
                    background: `linear-gradient(to right, ${passwordStrength.color} ${(passwordStrength.score + 1) * 20}%, #e5e7eb ${(passwordStrength.score + 1) * 20}%)`
                  }}
                />
                <span className="text-xs" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="url">Website URL (optional)</Label>
          <Input
            id="url"
            name="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Add any additional information here"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
        
        <Button type="submit" className="w-full bg-vault-purple hover:bg-vault-darkPurple">
          Save Password
        </Button>
      </form>
    </div>
  );
};

export default AddPassword;

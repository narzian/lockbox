
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Category color mapping
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Social": "#7C5DFA", // Purple
    "Finance": "#33C480", // Green
    "Work": "#FF8F00", // Orange 
    "Shopping": "#FF5C5C", // Red
    "Entertainment": "#1EAEDB", // Blue
    "Education": "#7E69AB", // Dark Purple
    "Government": "#5D5FEF", // Indigo
  };
  
  return colors[category] || "#8E9196"; // Default gray
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  // Basic password strength check
  let score = 0;
  
  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
  const colors = ["#FF5C5C", "#FF8F00", "#FFCC00", "#33C480", "#1EAEDB"];
  
  return {
    score,
    label: labels[score],
    color: colors[score]
  };
}

// Generate a secure random password
export function generatePassword(
  length: number = 16,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true
): string {
  let charset = "";
  
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+{}:<>?|[];,./";
  
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

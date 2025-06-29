
import { secureStorage } from '../secureStorage';

// Initial data and storage utilities
export const initialCategories = [
  "Social", "Finance", "Work", "Shopping", "Education", "Government", "Entertainment"
];

// Empty passwords array to start fresh
export type PasswordItem = {
  id: string;
  title: string;
  username: string;
  category: string;
  lastUsed: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
};

// Category to icon mapping
export const getCategoryIcon = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('social')) return 'hash';
  if (lowerCategory.includes('finance') || lowerCategory.includes('bank')) return 'banknote';
  if (lowerCategory.includes('work')) return 'briefcase';
  if (lowerCategory.includes('shop')) return 'cart';
  if (lowerCategory.includes('education') || lowerCategory.includes('school') || lowerCategory.includes('college')) return 'book';
  if (lowerCategory.includes('government') || lowerCategory.includes('gov')) return 'building';
  if (lowerCategory.includes('entertain')) return 'film';
  
  // For custom categories, use the first letter
  return category.charAt(0).toUpperCase();
};

export const mockPasswords: PasswordItem[] = [];

// Save data using secure storage
export const saveCategories = (categories: string[]) => {
  if (secureStorage.isEncryptionReady()) {
    secureStorage.saveCategories(categories);
  } else {
    // Fallback to localStorage if encryption not ready
    localStorage.setItem('categories', JSON.stringify(categories));
  }
};

export const savePasswords = (passwords: PasswordItem[]) => {
  if (secureStorage.isEncryptionReady()) {
    secureStorage.savePasswords(passwords);
  } else {
    // Fallback to localStorage if encryption not ready
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }
};

// Load data using secure storage
export const loadCategories = (): string[] => {
  if (secureStorage.isEncryptionReady()) {
    return secureStorage.loadCategories();
  } else {
    // Fallback to localStorage
    const storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : initialCategories;
  }
};

export const loadPasswords = (): PasswordItem[] => {
  if (secureStorage.isEncryptionReady()) {
    return secureStorage.loadPasswords();
  } else {
    // Fallback to localStorage
    const storedPasswords = localStorage.getItem('passwords');
    return storedPasswords ? JSON.parse(storedPasswords) : mockPasswords;
  }
};

// Get counts of passwords per category
export const getCategoryCounts = (categories: string[], passwords: PasswordItem[]) => {
  const counts: {[key: string]: number} = {};
  categories.forEach(cat => {
    counts[cat] = passwords.filter(pw => pw.category === cat).length;
  });
  // Add All count
  counts["All"] = passwords.length;
  return counts;
};

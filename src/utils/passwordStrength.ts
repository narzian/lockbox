
export interface PasswordStrengthResult {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  length: number;
  isCommon: boolean;
}

// Common weak passwords
const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon'
];

export const analyzePasswordStrength = (password: string): PasswordStrengthResult => {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  const length = password.length;
  const isCommon = commonPasswords.includes(password.toLowerCase());

  let score = 0;
  const suggestions: string[] = [];

  // Length scoring
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;
  else if (length < 8) suggestions.push('Use at least 8 characters');

  // Character variety scoring
  if (hasLowercase) score += 1;
  else suggestions.push('Add lowercase letters');

  if (hasUppercase) score += 1;
  else suggestions.push('Add uppercase letters');

  if (hasNumbers) score += 1;
  else suggestions.push('Add numbers');

  if (hasSymbols) score += 1;
  else suggestions.push('Add special characters');

  // Common password penalty
  if (isCommon) {
    score = Math.max(0, score - 2);
    suggestions.push('Avoid common passwords');
  }

  // Repeated characters penalty
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    suggestions.push('Avoid repeated characters');
  }

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a', '#059669'];

  const finalScore = Math.min(5, Math.max(0, score));

  return {
    score: finalScore,
    label: labels[finalScore],
    color: colors[finalScore],
    suggestions,
    hasLowercase,
    hasUppercase,
    hasNumbers,
    hasSymbols,
    length,
    isCommon
  };
};

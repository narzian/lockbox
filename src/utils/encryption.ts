
import CryptoJS from 'crypto-js';

// Generate a random salt
export const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(256/8).toString();
};

// Hash password with salt for verification
export const hashPassword = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString();
};

// Derive encryption key from master password
export const deriveKey = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString();
};

// Encrypt data with AES
export const encryptData = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

// Decrypt data with AES
export const decryptData = (encryptedData: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Check if encryption key is valid by trying to decrypt test data
export const validateKey = (key: string): boolean => {
  try {
    const testData = localStorage.getItem('testEncryption');
    if (!testData) return true; // No test data yet
    
    const decrypted = decryptData(testData, key);
    return decrypted === 'test';
  } catch {
    return false;
  }
};

// Set up test encryption data
export const setupTestEncryption = (key: string): void => {
  const encrypted = encryptData('test', key);
  localStorage.setItem('testEncryption', encrypted);
};

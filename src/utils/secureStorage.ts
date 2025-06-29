import { encryptData, decryptData } from './encryption';
import { PasswordItem } from './dashboard/storageUtils';

interface SecureStorageData {
  passwords: PasswordItem[];
  categories: string[];
  financials: any[];
}

class SecureStorage {
  private encryptionKey: string | null = null;

  setEncryptionKey(key: string) {
    this.encryptionKey = key;
  }

  private encrypt(data: any): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not set');
    }
    return encryptData(JSON.stringify(data), this.encryptionKey);
  }

  private decrypt(encryptedData: string): any {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not set');
    }
    const decrypted = decryptData(encryptedData, this.encryptionKey);
    return JSON.parse(decrypted);
  }

  // Save encrypted data
  savePasswords(passwords: PasswordItem[]): void {
    try {
      const encrypted = this.encrypt(passwords);
      localStorage.setItem('securePasswords', encrypted);
      // Keep unencrypted backup for migration (will be removed later)
      localStorage.setItem('passwords', JSON.stringify(passwords));
    } catch (error) {
      console.error('Failed to save passwords:', error);
      throw error;
    }
  }

  saveCategories(categories: string[]): void {
    try {
      const encrypted = this.encrypt(categories);
      localStorage.setItem('secureCategories', encrypted);
      // Keep unencrypted backup for migration
      localStorage.setItem('categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save categories:', error);
      throw error;
    }
  }

  saveFinancials(financials: any[]): void {
    try {
      const encrypted = this.encrypt(financials);
      localStorage.setItem('secureFinancials', encrypted);
      // Keep unencrypted backup for migration
      localStorage.setItem('financials', JSON.stringify(financials));
    } catch (error) {
      console.error('Failed to save financials:', error);
      throw error;
    }
  }

  // Load encrypted data
  loadPasswords(): PasswordItem[] {
    try {
      const encryptedData = localStorage.getItem('securePasswords');
      if (encryptedData && this.encryptionKey) {
        return this.decrypt(encryptedData);
      }
      
      // Fallback to unencrypted data for migration
      const unencryptedData = localStorage.getItem('passwords');
      return unencryptedData ? JSON.parse(unencryptedData) : [];
    } catch (error) {
      console.error('Failed to load passwords:', error);
      // Fallback to unencrypted data
      const unencryptedData = localStorage.getItem('passwords');
      return unencryptedData ? JSON.parse(unencryptedData) : [];
    }
  }

  loadCategories(): string[] {
    try {
      const encryptedData = localStorage.getItem('secureCategories');
      if (encryptedData && this.encryptionKey) {
        return this.decrypt(encryptedData);
      }
      
      // Fallback to unencrypted data for migration
      const unencryptedData = localStorage.getItem('categories');
      return unencryptedData ? JSON.parse(unencryptedData) : [
        "Social", "Finance", "Work", "Shopping", "Education", "Government", "Entertainment"
      ];
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to default categories
      return ["Social", "Finance", "Work", "Shopping", "Education", "Government", "Entertainment"];
    }
  }

  loadFinancials(): any[] {
    try {
      const encryptedData = localStorage.getItem('secureFinancials');
      if (encryptedData && this.encryptionKey) {
        return this.decrypt(encryptedData);
      }
      
      // Fallback to unencrypted data for migration
      const unencryptedData = localStorage.getItem('financials');
      return unencryptedData ? JSON.parse(unencryptedData) : [];
    } catch (error) {
      console.error('Failed to load financials:', error);
      return [];
    }
  }

  // Check if encryption is properly set up
  isEncryptionReady(): boolean {
    return this.encryptionKey !== null;
  }

  // Migration helper - encrypt existing unencrypted data
  migrateUnencryptedData(): void {
    if (!this.encryptionKey) return;

    try {
      // Migrate passwords
      const passwords = localStorage.getItem('passwords');
      if (passwords && !localStorage.getItem('securePasswords')) {
        this.savePasswords(JSON.parse(passwords));
      }

      // Migrate categories
      const categories = localStorage.getItem('categories');
      if (categories && !localStorage.getItem('secureCategories')) {
        this.saveCategories(JSON.parse(categories));
      }

      // Migrate financials
      const financials = localStorage.getItem('financials');
      if (financials && !localStorage.getItem('secureFinancials')) {
        this.saveFinancials(JSON.parse(financials));
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}

export const secureStorage = new SecureStorage();

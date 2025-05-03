
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { PasswordItem } from '@/components/PasswordItem';

interface Password {
  id: string;
  title: string;
  username: string;
  category: string;
  lastUsed?: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Password[]>([]);
  const [allPasswords, setAllPasswords] = useState<Password[]>([]);
  
  // Load passwords from localStorage
  useEffect(() => {
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      const parsedPasswords = JSON.parse(storedPasswords);
      setAllPasswords(parsedPasswords);
    }
  }, []);
  
  // Filter passwords when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = allPasswords.filter(
      password => 
        password.title?.toLowerCase().includes(query) ||
        password.username?.toLowerCase().includes(query) ||
        password.category?.toLowerCase().includes(query) ||
        password.notes?.toLowerCase().includes(query)
    );
    
    setSearchResults(filtered);
  }, [searchQuery, allPasswords]);
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, username, or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          autoFocus
        />
      </div>
      
      {searchQuery.trim() !== '' && searchResults.length > 0 ? (
        <div className="grid gap-3 animate-slide-up">
          {searchResults.map(password => (
            <Link key={password.id} to={`/password/${password.id}`}>
              <PasswordItem password={password} />
            </Link>
          ))}
        </div>
      ) : searchQuery.trim() !== '' ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-vault-softPurple rounded-full p-6 mb-4">
            <SearchIcon className="h-8 w-8 text-vault-purple" />
          </div>
          <h3 className="text-lg font-medium mb-1">No results found</h3>
          <p className="text-muted-foreground">
            Try a different search term or browse by category
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Search;

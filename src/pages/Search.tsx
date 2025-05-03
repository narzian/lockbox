
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { PasswordItem } from '@/components/PasswordItem';

// Mock data
const mockPasswords = [
  { 
    id: "1", 
    title: "Facebook", 
    username: "user@example.com", 
    category: "Social",
    lastUsed: "2 days ago",
    icon: "👤"
  },
  { 
    id: "2", 
    title: "Gmail", 
    username: "user@gmail.com", 
    category: "Social",
    lastUsed: "1 day ago",
    icon: "📧"
  },
  { 
    id: "3", 
    title: "Amazon", 
    username: "user@example.com", 
    category: "Shopping",
    lastUsed: "1 week ago",
    icon: "🛒"
  },
  { 
    id: "4", 
    title: "Chase Bank", 
    username: "username123", 
    category: "Finance",
    lastUsed: "3 days ago",
    icon: "💳"
  },
  { 
    id: "5", 
    title: "Netflix", 
    username: "user@example.com", 
    category: "Entertainment",
    lastUsed: "5 days ago",
    icon: "📺"
  },
  { 
    id: "6", 
    title: "LinkedIn", 
    username: "professional@email.com", 
    category: "Social",
    lastUsed: "2 weeks ago",
    icon: "👔"
  },
];

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockPasswords>([]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = mockPasswords.filter(
      password => 
        password.title.toLowerCase().includes(query) ||
        password.username.toLowerCase().includes(query) ||
        password.category.toLowerCase().includes(query)
    );
    
    setSearchResults(filtered);
  }, [searchQuery]);
  
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

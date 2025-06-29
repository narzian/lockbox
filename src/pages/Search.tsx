
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon, Filter, SortAsc, SortDesc } from 'lucide-react';
import { PasswordItem } from '@/components/PasswordItem';
import { loadPasswords, loadCategories } from '@/utils/dashboard/storageUtils';

import type { Password as PasswordItemType } from '@/components/PasswordItem';

type Password = PasswordItemType;

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Password[]>([]);
  const [allPasswords, setAllPasswords] = useState<Password[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Load passwords and categories
  useEffect(() => {
    const passwords = loadPasswords();
    const cats = loadCategories();
    setAllPasswords(passwords);
    setCategories(cats);
  }, []);
  
  // Filter and sort passwords
  useEffect(() => {
    let filtered = allPasswords;
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        password => 
          password.title?.toLowerCase().includes(query) ||
          password.username?.toLowerCase().includes(query) ||
          password.category?.toLowerCase().includes(query) ||
          (password.notes && password.notes.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(password => password.category === selectedCategory);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'recent':
          comparison = new Date(b.lastUsed || b.updatedAt || '').getTime() - 
                      new Date(a.lastUsed || a.updatedAt || '').getTime();
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    setSearchResults(filtered);
  }, [searchQuery, allPasswords, selectedCategory, sortBy, sortOrder]);
  
  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('name');
    setSortOrder('asc');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || sortBy !== 'name' || sortOrder !== 'asc';
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      
      <div className="space-y-4 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, username, category, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
          
          {hasActiveFilters && (
            <div className="flex gap-1">
              {selectedCategory !== 'all' && (
                <Badge variant="secondary">{selectedCategory}</Badge>
              )}
              {(sortBy !== 'name' || sortOrder !== 'asc') && (
                <Badge variant="secondary">
                  {sortBy} {sortOrder === 'desc' ? '↓' : '↑'}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={(value: 'name' | 'recent' | 'category') => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="recent">Recently Used</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Order</label>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full justify-start"
              >
                {sortOrder === 'asc' ? (
                  <>
                    <SortAsc className="h-4 w-4 mr-2" />
                    Ascending
                  </>
                ) : (
                  <>
                    <SortDesc className="h-4 w-4 mr-2" />
                    Descending
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {searchQuery.trim() !== '' || hasActiveFilters ? (
        searchResults.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-3 animate-slide-up">
              {searchResults.map(password => (
                <Link key={password.id} to={`/password/${password.id}`}>
                  <PasswordItem password={password} />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-primary/10 rounded-full p-6 mb-4">
              <SearchIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No results found</h3>
            <p className="text-muted-foreground">
              Try a different search term or adjust your filters
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-primary/10 rounded-full p-6 mb-4">
            <SearchIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">Search your passwords</h3>
          <p className="text-muted-foreground">
            Enter a search term or use filters to find specific passwords
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;

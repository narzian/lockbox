import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { CategorySidebar } from '@/components/dashboard/CategorySidebar';
import { CreateCategoryDialog } from '@/components/dashboard/CreateCategoryDialog';
import { SortDropdown } from '@/components/dashboard/SortDropdown';
import { EmptyState } from '@/components/EmptyState';
import { LockKeyhole, ArrowDown } from 'lucide-react';
import { PasswordItem } from '@/components/PasswordItem';

// Initial empty categories
const initialCategories = [
  "Social", "Finance", "Work", "Shopping", "Education", "Government", "Entertainment"
];

// Empty passwords array to start fresh
const mockPasswords: {
  id: string;
  title: string;
  username: string;
  category: string;
  lastUsed: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}[] = [];

// Sort functions
const sortByName = (a: any, b: any, ascending = true) => {
  const factor = ascending ? 1 : -1;
  return a.title.localeCompare(b.title) * factor;
};

const sortByRecent = (a: any, b: any, ascending = true) => {
  const timeMap: Record<string, number> = {
    "day": 1,
    "days": 1,
    "week": 7,
    "weeks": 7,
    "month": 30,
    "months": 30
  };
  
  const extractTime = (timeStr: string) => {
    const [num, unit] = timeStr.split(' ');
    return parseInt(num) * (timeMap[unit] || 1);
  };
  
  const timeA = extractTime(a.lastUsed);
  const timeB = extractTime(b.lastUsed);
  
  const factor = ascending ? 1 : -1;
  return (timeA - timeB) * factor;
};

// Save data to localStorage
const saveCategories = (categories: string[]) => {
  localStorage.setItem('categories', JSON.stringify(categories));
};

const savePasswords = (passwords: typeof mockPasswords) => {
  localStorage.setItem('passwords', JSON.stringify(passwords));
};

// Load data from localStorage
const loadCategories = (): string[] => {
  const storedCategories = localStorage.getItem('categories');
  return storedCategories ? JSON.parse(storedCategories) : initialCategories;
};

const loadPasswords = (): typeof mockPasswords => {
  const storedPasswords = localStorage.getItem('passwords');
  return storedPasswords ? JSON.parse(storedPasswords) : mockPasswords;
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"category" | "passwords">("category");
  const [sortMode, setSortMode] = useState<"nameAsc" | "nameDesc" | "recentAsc" | "recentDesc">("nameAsc");
  const [categories, setCategories] = useState<string[]>(loadCategories());
  const [passwords, setPasswords] = useState<typeof mockPasswords>(loadPasswords());

  // Save categories to localStorage when changed
  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  // Save passwords to localStorage when changed
  useEffect(() => {
    savePasswords(passwords);
  }, [passwords]);

  // Sort passwords based on current sort mode
  const sortPasswords = (passwords: typeof mockPasswords) => {
    const sorted = [...passwords];
    
    switch(sortMode) {
      case "nameAsc":
        return sorted.sort((a, b) => sortByName(a, b, true));
      case "nameDesc":
        return sorted.sort((a, b) => sortByName(a, b, false));
      case "recentAsc":
        return sorted.sort((a, b) => sortByRecent(a, b, true));
      case "recentDesc":
        return sorted.sort((a, b) => sortByRecent(a, b, false));
      default:
        return sorted;
    }
  };

  // Filter passwords based on active category
  const filteredPasswords = activeTab === "All" 
    ? sortPasswords(passwords) 
    : sortPasswords(passwords.filter(pw => pw.category === activeTab));

  // Get counts of passwords per category
  const getCategoryCounts = () => {
    const counts: {[key: string]: number} = {};
    categories.forEach(cat => {
      counts[cat] = passwords.filter(pw => pw.category === cat).length;
    });
    // Add All count
    counts["All"] = passwords.length;
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  // Handle creating a new category
  const handleCreateCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories(prevCategories => [...prevCategories, newCategory]);
    }
  };

  // Handle view all passwords
  const handleViewAll = () => {
    setActiveTab("All");
    setActiveCategoryIndex(0);
    setViewMode("passwords");
  };

  // Handle viewing a specific category
  const handleViewCategory = (category: string) => {
    setActiveTab(category);
    setActiveCategoryIndex(categories.indexOf(category) + 1); // +1 because "All" is at index 0
    setViewMode("passwords");
  };

  // Handle sidebar category selection
  const handleSelectCategory = (index: number) => {
    if (index === 0) {
      setActiveTab("All");
    } else {
      setActiveTab(categories[index - 1]); // -1 because "All" is not in categories array
    }
    setActiveCategoryIndex(index);
    setViewMode("passwords");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Vault</h1>
        <div className="flex gap-2">
          {viewMode === "passwords" && (
            <Button variant="outline" size="sm" onClick={() => setViewMode("category")}>
              Back to Categories
            </Button>
          )}
          
          {viewMode === "passwords" && <SortDropdown sortMode={sortMode} setSortMode={setSortMode} />}
          
          {viewMode === "category" && <CreateCategoryDialog onCreateCategory={handleCreateCategory} />}
        </div>
      </div>
      
      {viewMode === "category" ? (
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <Button 
              onClick={handleViewAll}
              variant="default"
              className="w-full max-w-xs"
            >
              View All Passwords ({categoryCounts["All"]})
            </Button>
          </div>
          
          {categoryCounts["All"] === 0 ? (
            <EmptyState 
              title="No passwords saved yet"
              description="Use the Add button in the navigation bar below to add your first password"
              icon={<div className="flex flex-col items-center">
                <LockKeyhole size={40} />
                <ArrowDown size={20} className="mt-2 animate-bounce" />
              </div>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 animate-slide-up">
              {categories.map(category => (
                <CategoryCard 
                  key={category}
                  category={category} 
                  count={categoryCounts[category]}
                  onClick={() => handleViewCategory(category)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Category sidebar */}
          <CategorySidebar 
            categories={categories}
            activeCategoryIndex={activeCategoryIndex}
            onSelectCategory={handleSelectCategory}
          />
          
          {/* Password list with sidebar margin */}
          <div className="ml-10">
            <h2 className="text-xl font-semibold mb-4">{activeTab}</h2>
            {filteredPasswords.length === 0 ? (
              <EmptyState 
                title={`No passwords in ${activeTab}`}
                description="Use the Add button in the navigation bar below to add a password to this category"
                icon={<div className="flex flex-col items-center">
                  <LockKeyhole size={40} />
                  <ArrowDown size={20} className="mt-2 animate-bounce" />
                </div>}
              />
            ) : (
              <div className="grid gap-3 animate-slide-up">
                {filteredPasswords.map(password => (
                  <Link key={password.id} to={`/password/${password.id}`}>
                    <PasswordItem password={password} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

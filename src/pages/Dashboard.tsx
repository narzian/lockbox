import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { CategoryTabs } from '@/components/dashboard/CategoryTabs';
import { CreateCategoryDialog } from '@/components/dashboard/CreateCategoryDialog';
import { SortDropdown } from '@/components/dashboard/SortDropdown';

// Mock data for categories and passwords
const initialCategories = [
  "Social", "Finance", "Work", "Shopping", "Education", "Government", "Entertainment"
];

const mockPasswords = [
  { 
    id: "1", 
    title: "Facebook", 
    username: "user@example.com", 
    category: "Social",
    lastUsed: "2 days ago",
    icon: "facebook"
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
    icon: "amazon"
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
  { 
    id: "7", 
    title: "Tax Portal", 
    username: "citizen123", 
    category: "Government",
    lastUsed: "1 month ago",
    icon: "🏛️"
  },
  { 
    id: "8", 
    title: "University Portal", 
    username: "student@university.edu", 
    category: "Education",
    lastUsed: "3 weeks ago",
    icon: "🎓"
  },
  { 
    id: "9", 
    title: "Instagram", 
    username: "user@example.com", 
    category: "Social",
    lastUsed: "4 days ago",
    icon: "instagram"
  },
];

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

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"category" | "passwords">("category");
  const [sortMode, setSortMode] = useState<"nameAsc" | "nameDesc" | "recentAsc" | "recentDesc">("nameAsc");
  const [categories, setCategories] = useState<string[]>(initialCategories);

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
    ? sortPasswords(mockPasswords) 
    : sortPasswords(mockPasswords.filter(pw => pw.category === activeTab));

  // Get counts of passwords per category
  const getCategoryCounts = () => {
    const counts: {[key: string]: number} = {};
    categories.forEach(cat => {
      counts[cat] = mockPasswords.filter(pw => pw.category === cat).length;
    });
    // Add All count
    counts["All"] = mockPasswords.length;
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  // Handle creating a new category
  const handleCreateCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  // Handle view all passwords
  const handleViewAll = () => {
    setActiveTab("All");
    setViewMode("passwords");
  };

  // Handle viewing a specific category
  const handleViewCategory = (category: string) => {
    setActiveTab(category);
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
        </div>
      ) : (
        <CategoryTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categories={categories}
          filteredPasswords={filteredPasswords}
        />
      )}
    </div>
  );
};

export default Dashboard;

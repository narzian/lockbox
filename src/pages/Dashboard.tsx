
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordItem } from '@/components/PasswordItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid, List, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for categories and passwords
const categories = [
  "All", "Social", "Finance", "Work", "Shopping", "Education", "Government"
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
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortMode, setSortMode] = useState<"nameAsc" | "nameDesc" | "recentAsc" | "recentDesc">("nameAsc");

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

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Vault</h1>
        <div className="flex gap-2">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <div className="dropdown relative">
            <Button variant="outline" size="sm" className="flex gap-2">
              {sortMode.includes('name') 
                ? (sortMode === 'nameAsc' ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />)
                : (sortMode === 'recentAsc' ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />)
              }
              <span className="sr-only md:not-sr-only md:inline-block">
                {sortMode === 'nameAsc' ? 'A-Z' 
                  : sortMode === 'nameDesc' ? 'Z-A' 
                  : sortMode === 'recentAsc' ? 'Oldest' 
                  : 'Newest'}
              </span>
            </Button>
            
            <div className="dropdown-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white hidden group-hover:block z-10">
              <button onClick={() => setSortMode("nameAsc")} className="block px-4 py-2 text-sm w-full text-left hover:bg-muted">
                Name (A-Z)
              </button>
              <button onClick={() => setSortMode("nameDesc")} className="block px-4 py-2 text-sm w-full text-left hover:bg-muted">
                Name (Z-A)
              </button>
              <button onClick={() => setSortMode("recentDesc")} className="block px-4 py-2 text-sm w-full text-left hover:bg-muted">
                Recently Used
              </button>
              <button onClick={() => setSortMode("recentAsc")} className="block px-4 py-2 text-sm w-full text-left hover:bg-muted">
                Oldest Used
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="All" onValueChange={setActiveTab}>
        <div className="mb-4 overflow-auto">
          <TabsList className="flex space-x-2 pb-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="whitespace-nowrap"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className={viewMode === "grid" ? "grid gap-3 animate-slide-up" : "space-y-3 animate-slide-up"}>
              {(category === "All" ? filteredPasswords : filteredPasswords)
                .filter(pw => category === "All" || pw.category === category)
                .map(password => (
                  <Link key={password.id} to={`/password/${password.id}`}>
                    <PasswordItem password={password} viewMode={viewMode} />
                  </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;

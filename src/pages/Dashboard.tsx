
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordItem } from '@/components/PasswordItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid, List, ArrowUpAZ, ArrowDownAZ, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for categories and passwords
const categories = [
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
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "category">("category");
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

  // Handle view all passwords
  const handleViewAll = () => {
    setActiveTab("All");
    setViewMode("grid");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Vault</h1>
        <div className="flex gap-2">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list" | "category")}>
            <ToggleGroupItem value="category" aria-label="Category view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
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
            
            <div className="dropdown-menu">
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
              <button 
                key={category} 
                onClick={() => {
                  setActiveTab(category);
                  setViewMode("grid");
                }}
                className="w-full"
              >
                <Card className="vault-card h-24 flex flex-col justify-between">
                  <div className="flex justify-between items-start w-full">
                    <Badge variant="outline" className="bg-secondary">
                      {category}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-end w-full">
                    <span className="text-2xl font-bold">{categoryCounts[category]}</span>
                    <span className="text-xs text-muted-foreground">Logins</span>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-4 overflow-auto">
            <TabsList className="flex space-x-2 pb-1">
              <TabsTrigger value="All" className="whitespace-nowrap">All</TabsTrigger>
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

          <TabsContent key="All" value="All" className="mt-0">
            <div className={viewMode === "grid" ? "grid gap-3 animate-slide-up" : "space-y-3 animate-slide-up"}>
              {filteredPasswords.map(password => (
                <Link key={password.id} to={`/password/${password.id}`}>
                  <PasswordItem password={password} viewMode={viewMode} />
                </Link>
              ))}
            </div>
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className={viewMode === "grid" ? "grid gap-3 animate-slide-up" : "space-y-3 animate-slide-up"}>
                {filteredPasswords
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
      )}
    </div>
  );
};

export default Dashboard;

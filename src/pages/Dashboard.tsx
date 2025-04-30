
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordItem } from '@/components/PasswordItem';
import { useIsMobile } from '@/hooks/use-mobile';

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
];

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("All");

  // Filter passwords based on active category
  const filteredPasswords = activeTab === "All" 
    ? mockPasswords 
    : mockPasswords.filter(pw => pw.category === activeTab);

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Your Vault</h1>
      
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
            <div className="grid gap-3 animate-slide-up">
              {(category === "All" ? mockPasswords : filteredPasswords)
                .filter(pw => category === "All" || pw.category === category)
                .map(password => (
                  <Link key={password.id} to={`/password/${password.id}`}>
                    <PasswordItem password={password} />
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

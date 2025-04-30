
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PasswordItem } from '@/components/PasswordItem';
import { Link } from 'react-router-dom';

interface CategoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: string[];
  filteredPasswords: any[];
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  categories, 
  filteredPasswords 
}) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
      <div className="mb-4 overflow-x-auto">
        <TabsList className="flex w-max space-x-2 pb-1">
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
        <div className="grid gap-3 animate-slide-up">
          {filteredPasswords.map(password => (
            <Link key={password.id} to={`/password/${password.id}`}>
              <PasswordItem password={password} />
            </Link>
          ))}
        </div>
      </TabsContent>
      
      {categories.map(category => (
        <TabsContent key={category} value={category} className="mt-0">
          <div className="grid gap-3 animate-slide-up">
            {filteredPasswords
              .filter(pw => pw.category === category)
              .map(password => (
                <Link key={password.id} to={`/password/${password.id}`}>
                  <PasswordItem password={password} />
                </Link>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

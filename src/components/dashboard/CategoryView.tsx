
import React from 'react';
import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { EmptyState } from '@/components/EmptyState';
import { LockKeyhole, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CategoryViewProps {
  categoryCounts: {[key: string]: number};
  categories: string[];
  handleViewAll: () => void;
  handleViewCategory: (category: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ 
  categoryCounts, 
  categories, 
  handleViewAll,
  handleViewCategory 
}) => {
  return (
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
  );
};

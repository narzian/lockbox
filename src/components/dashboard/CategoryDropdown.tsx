
import React from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, BookOpen, Banknote, Building } from 'lucide-react';
import { getCategoryIcon } from '@/utils/dashboard/storageUtils';

interface CategoryDropdownProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string, index: number) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  // Render icon based on category
  const renderCategoryIcon = (category: string) => {
    const iconName = getCategoryIcon(category);
    
    switch(iconName) {
      case 'book':
        return <BookOpen size={16} />;
      case 'banknote':
        return <Banknote size={16} />;
      case 'building':
        return <Building size={16} />;
      default:
        return <span>{iconName}</span>;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            {renderCategoryIcon(activeCategory)}
            {activeCategory}
          </span>
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <Button
            variant={activeCategory === "All" ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => onSelectCategory("All", 0)}
          >
            <span className="flex items-center gap-2">
              All
            </span>
          </Button>
          
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onSelectCategory(category, index + 1)}
            >
              <span className="flex items-center gap-2">
                {renderCategoryIcon(category)}
                {category}
              </span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

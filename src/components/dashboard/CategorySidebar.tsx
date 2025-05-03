import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CategorySidebarProps {
  categories: string[];
  activeCategoryIndex: number;
  onSelectCategory: (index: number) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  activeCategoryIndex,
  onSelectCategory
}) => {
  return (
    <div className="fixed left-0 top-1/4 h-1/2 w-8 z-10 bg-card/50 rounded-r-lg shadow-md flex items-center border-r border-t border-b border-border">
      <ScrollArea className="h-full w-full">
        <TooltipProvider delayDuration={100}>
          <div className="py-2 flex flex-col items-center gap-3">
            {/* All category */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => onSelectCategory(0)}
                  className={`w-5 h-5 rounded-full transition-all ${
                    activeCategoryIndex === 0 
                      ? 'bg-primary' 
                      : 'bg-secondary hover:bg-primary/50'
                  }`}
                />
              </TooltipTrigger>
              <TooltipContent side="right">
                All
              </TooltipContent>
            </Tooltip>
            
            {/* Other categories */}
            {categories.map((category, index) => (
              <Tooltip key={category}>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => onSelectCategory(index + 1)}
                    className={`w-5 h-5 rounded-full transition-all ${
                      activeCategoryIndex === index + 1 
                        ? 'bg-primary' 
                        : 'bg-secondary hover:bg-primary/50'
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent side="right">
                  {category}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </ScrollArea>
    </div>
  );
};


import React from 'react';
import { Link } from 'react-router-dom';
import { PasswordItem as PasswordItemComponent } from '@/components/PasswordItem';
import { EmptyState } from '@/components/EmptyState';
import { LockKeyhole, ArrowDown } from 'lucide-react';
import { CategoryDropdown } from '@/components/dashboard/CategoryDropdown';
import type { PasswordItem } from '@/utils/dashboard/storageUtils';

interface PasswordsViewProps {
  activeTab: string;
  activeCategoryIndex: number;
  categories: string[];
  filteredPasswords: PasswordItem[];
  onSelectCategory: (index: number) => void;
}

export const PasswordsView: React.FC<PasswordsViewProps> = ({ 
  activeTab, 
  activeCategoryIndex, 
  categories, 
  filteredPasswords, 
  onSelectCategory 
}) => {
  const handleSelectCategory = (category: string, index: number) => {
    onSelectCategory(index);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{activeTab}</h2>
        
        <CategoryDropdown 
          categories={categories}
          activeCategory={activeTab}
          onSelectCategory={handleSelectCategory}
        />
      </div>
      
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
              <PasswordItemComponent password={password} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

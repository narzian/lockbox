
import React from 'react';
import { Link } from 'react-router-dom';
import { PasswordItem as PasswordItemComponent } from '@/components/PasswordItem';
import { CategorySidebar } from '@/components/dashboard/CategorySidebar';
import { EmptyState } from '@/components/EmptyState';
import { LockKeyhole, ArrowDown } from 'lucide-react';
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
  return (
    <div className="relative">
      {/* Category sidebar */}
      <CategorySidebar 
        categories={categories}
        activeCategoryIndex={activeCategoryIndex}
        onSelectCategory={onSelectCategory}
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
                <PasswordItemComponent password={password} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

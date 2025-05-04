
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreateCategoryDialog } from '@/components/dashboard/CreateCategoryDialog';
import { SortDropdown } from '@/components/dashboard/SortDropdown';
import { CategoryView } from '@/components/dashboard/CategoryView';
import { PasswordsView } from '@/components/dashboard/PasswordsView';
import { useDashboardState } from '@/hooks/useDashboardState';

const Dashboard: React.FC = () => {
  const {
    activeTab,
    activeCategoryIndex,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    categories,
    filteredPasswords,
    categoryCounts,
    handleCreateCategory,
    handleViewAll,
    handleViewCategory,
    handleSelectCategory
  } = useDashboardState();

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
        <CategoryView 
          categoryCounts={categoryCounts}
          categories={categories}
          handleViewAll={handleViewAll}
          handleViewCategory={handleViewCategory}
        />
      ) : (
        <PasswordsView 
          activeTab={activeTab}
          activeCategoryIndex={activeCategoryIndex}
          categories={categories}
          filteredPasswords={filteredPasswords}
          onSelectCategory={handleSelectCategory}
        />
      )}
    </div>
  );
};

export default Dashboard;

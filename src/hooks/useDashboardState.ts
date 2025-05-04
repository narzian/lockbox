
import { useState, useEffect } from 'react';
import { 
  loadCategories, 
  loadPasswords, 
  saveCategories, 
  savePasswords,
  getCategoryCounts,
  type PasswordItem
} from '@/utils/dashboard/storageUtils';
import { sortByName, sortByRecent } from '@/utils/dashboard/sortUtils';

type SortMode = "nameAsc" | "nameDesc" | "recentAsc" | "recentDesc";

export const useDashboardState = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"category" | "passwords">("category");
  const [sortMode, setSortMode] = useState<SortMode>("nameAsc");
  const [categories, setCategories] = useState<string[]>(loadCategories());
  const [passwords, setPasswords] = useState<PasswordItem[]>(loadPasswords());

  // Save categories to localStorage when changed
  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  // Save passwords to localStorage when changed
  useEffect(() => {
    savePasswords(passwords);
  }, [passwords]);
  
  // Sort passwords based on current sort mode
  const sortPasswords = (passwords: PasswordItem[]) => {
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
    ? sortPasswords(passwords) 
    : sortPasswords(passwords.filter(pw => pw.category === activeTab));

  const categoryCounts = getCategoryCounts(categories, passwords);

  // Handle creating a new category
  const handleCreateCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories(prevCategories => [...prevCategories, newCategory]);
    }
  };

  // Handle view all passwords
  const handleViewAll = () => {
    setActiveTab("All");
    setActiveCategoryIndex(0);
    setViewMode("passwords");
  };

  // Handle viewing a specific category
  const handleViewCategory = (category: string) => {
    setActiveTab(category);
    setActiveCategoryIndex(categories.indexOf(category) + 1); // +1 because "All" is at index 0
    setViewMode("passwords");
  };

  // Handle sidebar category selection
  const handleSelectCategory = (index: number) => {
    if (index === 0) {
      setActiveTab("All");
    } else {
      setActiveTab(categories[index - 1]); // -1 because "All" is not in categories array
    }
    setActiveCategoryIndex(index);
    setViewMode("passwords");
  };

  return {
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
  };
};

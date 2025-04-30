
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react";

type SortMode = "nameAsc" | "nameDesc" | "recentAsc" | "recentDesc";

interface SortDropdownProps {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ sortMode, setSortMode }) => {
  return (
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
  );
};

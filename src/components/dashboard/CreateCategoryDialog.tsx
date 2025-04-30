
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CreateCategoryDialogProps {
  onCreateCategory: (category: string) => void;
}

export const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({ onCreateCategory }) => {
  const [newCategory, setNewCategory] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (newCategory.trim()) {
      onCreateCategory(newCategory.trim());
      setNewCategory("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2 ml-2">
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mb-4"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

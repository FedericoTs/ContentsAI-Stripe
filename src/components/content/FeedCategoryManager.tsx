import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Tag,
  Folder,
  RefreshCw,
} from "lucide-react";
import {
  getUserFeedCategories,
  addFeedCategory,
  updateCategoryName,
} from "@/lib/rss-service";

interface FeedCategoryManagerProps {
  onCategorySelect?: (category: string | null) => void;
  selectedCategory?: string | null;
}

const FeedCategoryManager: React.FC<FeedCategoryManagerProps> = ({
  onCategorySelect,
  selectedCategory,
}) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366f1"); // Default indigo color
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from the database
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { success, data, error } = await getUserFeedCategories();
      if (success && data) {
        setCategories(data);
      } else {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { success, data, error } = await addFeedCategory(
        newCategoryName,
        newCategoryColor,
      );

      if (success) {
        toast({
          title: "Success",
          description: "Category added successfully",
        });
        setNewCategoryName("");
        setNewCategoryColor("#6366f1");
        setAddCategoryDialogOpen(false);
        fetchCategories();
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to add category",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit category
  const handleEditCategory = (category: any) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      color: category.color,
    });
    setEditDialogOpen(true);
  };

  // Update category name
  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    if (!editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { success, data, error } = await updateCategoryName(
        editingCategory.id,
        editingCategory.name,
        editingCategory.color,
      );

      if (success) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
        setEditDialogOpen(false);
        setEditingCategory(null);
        fetchCategories();

        // If the renamed category was selected, update the selection
        if (selectedCategory && data && selectedCategory !== data.name) {
          onCategorySelect && onCategorySelect(data.name);
        }
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to update category",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Feed Categories</CardTitle>
        <CardDescription>
          Organize your RSS feeds with categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onCategorySelect && onCategorySelect(null)}
          >
            All Categories
          </Badge>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-1">
              <Badge
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                className="cursor-pointer"
                style={{
                  backgroundColor:
                    selectedCategory === category.name
                      ? category.color
                      : "transparent",
                  borderColor: category.color,
                  color:
                    selectedCategory === category.name
                      ? "white"
                      : category.color,
                }}
                onClick={() =>
                  onCategorySelect && onCategorySelect(category.name)
                }
              >
                <Folder className="h-3 w-3 mr-1" />
                {category.name}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategory(category);
                }}
              >
                <Edit className="h-3 w-3 text-gray-400" />
              </Button>
            </div>
          ))}
        </div>

        <Dialog
          open={addCategoryDialogOpen}
          onOpenChange={setAddCategoryDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category to organize your RSS feeds
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <Input
                  placeholder="Technology"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="h-10 w-10 rounded cursor-pointer"
                  />
                  <Input
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddCategoryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingCategory(null);
          }}
        >
          <DialogContent className="bg-gray-900 border-gray-800">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the name or color of this category
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category Name</label>
                  <Input
                    placeholder="Technology"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingCategory.color}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          color: e.target.value,
                        })
                      }
                      className="h-10 w-10 rounded cursor-pointer"
                    />
                    <Input
                      value={editingCategory.color}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          color: e.target.value,
                        })
                      }
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FeedCategoryManager;

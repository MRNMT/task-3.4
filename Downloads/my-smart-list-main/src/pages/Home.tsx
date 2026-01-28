import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  SortAsc, 
  SortDesc, 
  Loader2, 
  ShoppingCart,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  setLists, 
  setCurrentList, 
  addList, 
  updateList, 
  deleteList,
  addItem,
  updateItem,
  deleteItem,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  ShoppingList,
  ShoppingItem,
  ItemCategory,
} from '@/store/slices/shoppingListSlice';
import { shoppingListService } from '@/services/shoppingListService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ShoppingListCard from '@/components/shopping/ShoppingListCard';
import CreateListDialog from '@/components/shopping/CreateListDialog';
import AddItemDialog from '@/components/shopping/AddItemDialog';
import ShareListDialog from '@/components/shopping/ShareListDialog';
import ShoppingItemRow from '@/components/shopping/ShoppingItemRow';
import { toast } from 'sonner';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { lists, currentList, isLoading, searchQuery, sortBy, sortOrder } = useAppSelector(
    (state) => state.shoppingList
  );
  const { user } = useAppSelector((state) => state.auth);

  // Dialog states
  const [createListOpen, setCreateListOpen] = useState(false);
  const [editListOpen, setEditListOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [shareListOpen, setShareListOpen] = useState(false);
  const [deleteListOpen, setDeleteListOpen] = useState(false);
  const [deleteItemOpen, setDeleteItemOpen] = useState(false);
  
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Sync URL params with state
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlSort = searchParams.get('sort') as 'name' | 'category' | 'date' || 'date';
    const urlOrder = searchParams.get('order') as 'asc' | 'desc' || 'desc';
    
    dispatch(setSearchQuery(urlSearch));
    dispatch(setSortBy(urlSort));
    dispatch(setSortOrder(urlOrder));
  }, [searchParams, dispatch]);

  // Fetch lists on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await shoppingListService.fetchLists();
        dispatch(setLists(data));
      } catch (error) {
        toast.error('Failed to load shopping lists');
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // Update URL when search/sort changes
  const updateUrlParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
    updateUrlParams('search', value);
  };

  const handleSortChange = (value: 'name' | 'category' | 'date') => {
    dispatch(setSortBy(value));
    updateUrlParams('sort', value);
  };

  const handleOrderToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSortOrder(newOrder));
    updateUrlParams('order', newOrder);
  };

  // Filter and sort lists
  const filteredAndSortedLists = useMemo(() => {
    let result = [...lists];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        list =>
          list.name.toLowerCase().includes(query) ||
          list.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          const aCat = a.items[0]?.category || 'zzz';
          const bCat = b.items[0]?.category || 'zzz';
          comparison = aCat.localeCompare(bCat);
          break;
        case 'date':
        default:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [lists, searchQuery, sortBy, sortOrder]);

  // CRUD handlers
  const handleCreateList = async (data: { name: string; description?: string }) => {
    try {
      const newList = await shoppingListService.createList(data.name, data.description);
      dispatch(addList(newList));
      toast.success('List created successfully');
    } catch (error) {
      toast.error('Failed to create list');
    }
  };

  const handleUpdateList = async (data: { name: string; description?: string }) => {
    if (!selectedList) return;
    try {
      const updated = await shoppingListService.updateList(selectedList.id, data);
      dispatch(updateList(updated));
      toast.success('List updated successfully');
    } catch (error) {
      toast.error('Failed to update list');
    }
  };

  const handleDeleteList = async () => {
    if (!selectedList) return;
    try {
      await shoppingListService.deleteList(selectedList.id);
      dispatch(deleteList(selectedList.id));
      toast.success('List deleted successfully');
      setDeleteListOpen(false);
      setSelectedList(null);
    } catch (error) {
      toast.error('Failed to delete list');
    }
  };

  const handleShareList = async (email: string) => {
    if (!selectedList) return;
    try {
      await shoppingListService.shareList(selectedList.id, email);
      toast.success(`List shared with ${email}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to share list');
    }
  };

  const handleAddItem = async (data: {
    name: string;
    quantity: number;
    notes?: string;
    category: ItemCategory;
    imageUrl?: string;
  }) => {
    if (!currentList) return;
    try {
      const newItem = await shoppingListService.addItem(currentList.id, data);
      dispatch(addItem({ listId: currentList.id, item: newItem }));
      toast.success('Item added successfully');
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const handleUpdateItem = async (data: {
    name: string;
    quantity: number;
    notes?: string;
    category: ItemCategory;
    imageUrl?: string;
  }) => {
    if (!selectedItem) return;
    try {
      const updated = await shoppingListService.updateItem(selectedItem.id, data);
      dispatch(updateItem(updated));
      toast.success('Item updated successfully');
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem || !currentList) return;
    try {
      await shoppingListService.deleteItem(selectedItem.id);
      dispatch(deleteItem({ listId: currentList.id, itemId: selectedItem.id }));
      toast.success('Item deleted successfully');
      setDeleteItemOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleToggleComplete = async (item: ShoppingItem) => {
    try {
      const updated = await shoppingListService.toggleItemComplete(item.id, !item.isCompleted);
      dispatch(updateItem(updated));
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your lists...</p>
        </div>
      </div>
    );
  }

  // Detail view for a selected list
  if (currentList) {
    return (
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setCurrentList(null))}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold">{currentList.name}</h1>
            {currentList.description && (
              <p className="text-muted-foreground">{currentList.description}</p>
            )}
          </div>
          <Button onClick={() => setAddItemOpen(true)} className="btn-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Items list */}
        {currentList.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="bg-muted/50 p-6 rounded-full mb-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No items yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding items to your shopping list
            </p>
            <Button onClick={() => setAddItemOpen(true)} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {currentList.items.map((item) => (
                <ShoppingItemRow
                  key={item.id}
                  item={item}
                  onToggleComplete={() => handleToggleComplete(item)}
                  onEdit={() => {
                    setSelectedItem(item);
                    setEditItemOpen(true);
                  }}
                  onDelete={() => {
                    setSelectedItem(item);
                    setDeleteItemOpen(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add Item Dialog */}
        <AddItemDialog
          open={addItemOpen}
          onOpenChange={setAddItemOpen}
          onSubmit={handleAddItem}
        />

        {/* Edit Item Dialog */}
        {selectedItem && (
          <AddItemDialog
            open={editItemOpen}
            onOpenChange={setEditItemOpen}
            onSubmit={handleUpdateItem}
            editData={{
              name: selectedItem.name,
              quantity: selectedItem.quantity,
              notes: selectedItem.notes,
              category: selectedItem.category,
              imageUrl: selectedItem.imageUrl,
            }}
            isEdit
          />
        )}

        {/* Delete Item Confirmation */}
        <AlertDialog open={deleteItemOpen} onOpenChange={setDeleteItemOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Item</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Lists view
  return (
    <div className="animate-fade-in">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Hello, {user?.name || 'there'}! 
        </h1>
        <p className="text-muted-foreground">
          Manage your shopping lists and never forget an item.
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search lists or items..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Sort controls */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px] h-11">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11"
            onClick={handleOrderToggle}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>

          <Button onClick={() => setCreateListOpen(true)} className="btn-gradient-primary h-11">
            <Plus className="h-4 w-4 mr-2" />
            New List
          </Button>
        </div>
      </motion.div>

      {/* Lists grid */}
      {filteredAndSortedLists.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="bg-primary/10 p-6 rounded-full mb-4">
            <ShoppingCart className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {searchQuery ? 'No lists found' : 'No shopping lists yet'}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Create your first shopping list to get started organizing your groceries.'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setCreateListOpen(true)} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First List
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedLists.map((list) => (
              <ShoppingListCard
                key={list.id}
                list={list}
                onSelect={() => dispatch(setCurrentList(list))}
                onEdit={() => {
                  setSelectedList(list);
                  setEditListOpen(true);
                }}
                onDelete={() => {
                  setSelectedList(list);
                  setDeleteListOpen(true);
                }}
                onShare={() => {
                  setSelectedList(list);
                  setShareListOpen(true);
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Dialogs */}
      <CreateListDialog
        open={createListOpen}
        onOpenChange={setCreateListOpen}
        onSubmit={handleCreateList}
      />

      {selectedList && (
        <>
          <CreateListDialog
            open={editListOpen}
            onOpenChange={setEditListOpen}
            onSubmit={handleUpdateList}
            editData={{
              name: selectedList.name,
              description: selectedList.description,
            }}
            isEdit
          />

          <ShareListDialog
            open={shareListOpen}
            onOpenChange={setShareListOpen}
            onSubmit={handleShareList}
            listName={selectedList.name}
          />

          <AlertDialog open={deleteListOpen} onOpenChange={setDeleteListOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete List</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{selectedList.name}"? This will also delete all items in the list. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteList} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default Home;

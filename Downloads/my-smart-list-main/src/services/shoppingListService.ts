import { localStorageService } from './localStorageService';
import { ShoppingList, ShoppingItem, ItemCategory } from '@/store/slices/shoppingListSlice';

export const shoppingListService = {
  // Fetch all lists with their items
  async fetchLists(): Promise<ShoppingList[]> {
    return localStorageService.getLists();
  },

  // Create a new list
  async createList(name: string, description?: string): Promise<ShoppingList> {
    return localStorageService.createList(name, description);
  },

  // Update a list
  async updateList(id: string, updates: { name?: string; description?: string }): Promise<ShoppingList> {
    return localStorageService.updateList(id, updates);
  },

  // Delete a list
  async deleteList(id: string): Promise<void> {
    await localStorageService.deleteList(id);
  },

  // Share a list
  async shareList(id: string, email: string): Promise<void> {
    await localStorageService.shareList(id, email);
  },

  // Add an item to a list
  async addItem(listId: string, item: {
    name: string;
    quantity: number;
    notes?: string;
    category: ItemCategory;
    imageUrl?: string;
  }): Promise<ShoppingItem> {
    return localStorageService.addItem(listId, item);
  },

  // Update an item
  async updateItem(id: string, updates: Partial<{
    name: string;
    quantity: number;
    notes: string;
    category: ItemCategory;
    imageUrl: string;
    isCompleted: boolean;
  }>): Promise<ShoppingItem> {
    return localStorageService.updateItem(id, updates);
  },

  // Delete an item
  async deleteItem(id: string): Promise<void> {
    localStorageService.deleteItem(id);
  },

  // Toggle item completion
  async toggleItemComplete(id: string, isCompleted: boolean): Promise<ShoppingItem> {
    return localStorageService.toggleItemComplete(id, isCompleted);
  },
};

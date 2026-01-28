import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ItemCategory = 
  | 'groceries' 
  | 'dairy' 
  | 'meat' 
  | 'bakery' 
  | 'beverages' 
  | 'frozen' 
  | 'snacks' 
  | 'household' 
  | 'personal_care' 
  | 'other';

export interface ShoppingItem {
  id: string;
  listId: string;
  userId: string;
  name: string;
  quantity: number;
  notes?: string;
  category: ItemCategory;
  imageUrl?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isShared: boolean;
  sharedWith: string[];
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}

interface ShoppingListState {
  lists: ShoppingList[];
  currentList: ShoppingList | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'name' | 'category' | 'date';
  sortOrder: 'asc' | 'desc';
}

const initialState: ShoppingListState = {
  lists: [],
  currentList: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.lists = action.payload;
      state.isLoading = false;
    },
    setCurrentList: (state, action: PayloadAction<ShoppingList | null>) => {
      state.currentList = action.payload;
    },
    addList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.unshift(action.payload);
    },
    updateList: (state, action: PayloadAction<ShoppingList>) => {
      const index = state.lists.findIndex(list => list.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
      if (state.currentList?.id === action.payload.id) {
        state.currentList = action.payload;
      }
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(list => list.id !== action.payload);
      if (state.currentList?.id === action.payload) {
        state.currentList = null;
      }
    },
    addItem: (state, action: PayloadAction<{ listId: string; item: ShoppingItem }>) => {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        list.items.push(action.payload.item);
      }
      if (state.currentList?.id === action.payload.listId) {
        state.currentList.items.push(action.payload.item);
      }
    },
    updateItem: (state, action: PayloadAction<ShoppingItem>) => {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        const itemIndex = list.items.findIndex(i => i.id === action.payload.id);
        if (itemIndex !== -1) {
          list.items[itemIndex] = action.payload;
        }
      }
      if (state.currentList?.id === action.payload.listId) {
        const itemIndex = state.currentList.items.findIndex(i => i.id === action.payload.id);
        if (itemIndex !== -1) {
          state.currentList.items[itemIndex] = action.payload;
        }
      }
    },
    deleteItem: (state, action: PayloadAction<{ listId: string; itemId: string }>) => {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        list.items = list.items.filter(i => i.id !== action.payload.itemId);
      }
      if (state.currentList?.id === action.payload.listId) {
        state.currentList.items = state.currentList.items.filter(i => i.id !== action.payload.itemId);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'category' | 'date'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
  },
});

export const {
  setLists,
  setCurrentList,
  addList,
  updateList,
  deleteList,
  addItem,
  updateItem,
  deleteItem,
  setLoading,
  setError,
  setSearchQuery,
  setSortBy,
  setSortOrder,
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;

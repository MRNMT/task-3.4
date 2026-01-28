import { ShoppingList, ShoppingItem, ItemCategory } from '@/store/slices/shoppingListSlice';

const API_BASE_URL = 'http://localhost:3001';

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const localStorageService = {
  // Get all lists with their items
  getLists: async (): Promise<ShoppingList[]> => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('smart_list_user') || '{}');
      if (!currentUser.id) return [];

      const [listsResponse, itemsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/lists`),
        fetch(`${API_BASE_URL}/items`)
      ]);

      const allLists: ShoppingList[] = await listsResponse.json();
      const items: ShoppingItem[] = await itemsResponse.json();

      // Filter lists to show only user's own lists or shared lists
      const userLists = allLists.filter(list =>
        list.userId === currentUser.id ||
        (list.isShared && list.sharedWith?.includes(currentUser.email))
      );

      return userLists.map(list => ({
        ...list,
        items: items.filter(item => item.listId === list.id),
      }));
    } catch {
      return [];
    }
  },

  // Create a new list
  createList: async (name: string, description?: string): Promise<ShoppingList> => {
    const currentUser = JSON.parse(localStorage.getItem('smart_list_user') || '{}');
    if (!currentUser.id) throw new Error('Not authenticated');

    const newList: ShoppingList = {
      id: generateId(),
      userId: currentUser.id,
      name,
      description,
      isShared: false,
      sharedWith: [],
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newList),
    });

    if (!response.ok) {
      throw new Error('Failed to create list');
    }

    return await response.json();
  },

  // Update a list
  updateList: async (id: string, updates: { name?: string; description?: string }): Promise<ShoppingList> => {
    const response = await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update list');
    }

    const updatedList = await response.json();
    const itemsResponse = await fetch(`${API_BASE_URL}/items?listId=${id}`);
    const items = await itemsResponse.json();

    return {
      ...updatedList,
      items,
    };
  },

  // Delete a list
  deleteList: async (id: string): Promise<void> => {
    // Delete items first
    const itemsResponse = await fetch(`${API_BASE_URL}/items?listId=${id}`);
    const items = await itemsResponse.json();
    await Promise.all(items.map((item: ShoppingItem) => 
      fetch(`${API_BASE_URL}/items/${item.id}`, { method: 'DELETE' })
    ));

    // Delete list
    await fetch(`${API_BASE_URL}/lists/${id}`, { method: 'DELETE' });
  },

  // Share a list (simplified for local storage)
  shareList: async (id: string, email: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/lists/${id}`);
    const list = await response.json();

    if (!list) throw new Error('List not found');

    const updatedList = {
      ...list,
      isShared: true,
      sharedWith: [...(list.sharedWith || []), email],
      updatedAt: new Date().toISOString(),
    };

    await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedList),
    });
  },

  // Add an item to a list
  addItem: async (listId: string, item: {
    name: string;
    quantity: number;
    notes?: string;
    category: ItemCategory;
    imageUrl?: string;
  }): Promise<ShoppingItem> => {
    const currentUser = JSON.parse(localStorage.getItem('smart_list_user') || '{}');
    if (!currentUser.id) throw new Error('Not authenticated');

    const newItem: ShoppingItem = {
      id: generateId(),
      listId,
      userId: currentUser.id,
      name: item.name,
      quantity: item.quantity,
      notes: item.notes,
      category: item.category,
      imageUrl: item.imageUrl,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    });

    if (!response.ok) {
      throw new Error('Failed to add item');
    }

    return await response.json();
  },

  // Update an item
  updateItem: async (id: string, updates: Partial<{
    name: string;
    quantity: number;
    notes: string;
    category: ItemCategory;
    imageUrl: string;
    isCompleted: boolean;
  }>): Promise<ShoppingItem> => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update item');
    }

    return await response.json();
  },

  // Delete an item
  deleteItem: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/items/${id}`, { method: 'DELETE' });
  },

  // Toggle item completion
  toggleItemComplete: async (id: string, isCompleted: boolean): Promise<ShoppingItem> => {
    return await localStorageService.updateItem(id, { isCompleted });
  },
};

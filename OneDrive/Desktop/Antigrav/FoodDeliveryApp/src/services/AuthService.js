import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'USERS';
const CURRENT_USER_KEY = 'CURRENT_USER';

// Simulate delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthService = {
  register: async (userData) => {
    await delay(1000);
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      const existingUser = users.find((u) => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = { ...userData, id: Date.now().toString() };
      users.push(newUser);
      
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    await delay(1000);
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find((u) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  },

 getCurrentUser: async () => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('AsyncStorage error:', error);
    return null; // Return null so app can continue
  }
},

  updateProfile: async (updatedData) => {
    await delay(500);
    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserJson) throw new Error('No user logged in');
    
    let currentUser = JSON.parse(currentUserJson);
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    let users = usersJson ? JSON.parse(usersJson) : [];

    // Update current user object
    currentUser = { ...currentUser, ...updatedData };
    
    // Update user in the list
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      return currentUser;
    }
    throw new Error('User record not found');
  }
};

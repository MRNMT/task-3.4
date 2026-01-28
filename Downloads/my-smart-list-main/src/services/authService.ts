import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  cellNumber: string;
  password: string;
}

const API_BASE_URL = 'http://localhost:3001';
const STORAGE_KEY = 'smart_list_user';

export const authService = {
  // Sign up a new user
  signUp: async (email: string, password: string, metadata: { name: string; surname: string; cell_number: string }): Promise<{ error: Error | null }> => {
    try {
      // Check if user already exists
      const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
      const existingUsers = await response.json();
      if (existingUsers.length > 0) {
        return { error: new Error('User already exists') };
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        name: metadata.name,
        surname: metadata.surname,
        cellNumber: metadata.cell_number,
      };

      // Store user data
      const postResponse = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!postResponse.ok) {
        throw new Error('Failed to create user');
      }

      const createdUser = await postResponse.json();
      const { password: _, ...userWithoutPassword } = createdUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Sign in
  signIn: async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
      const users = await response.json();

      if (users.length === 0) {
        return { error: new Error('Invalid credentials') };
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { error: new Error('Invalid credentials') };
      }

      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get current user
  getCurrentUser: (): Omit<User, 'password'> | null => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },
};

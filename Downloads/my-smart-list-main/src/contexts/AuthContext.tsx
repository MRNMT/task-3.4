import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';
import { setUser, setLoading, logout } from '@/store/slices/authSlice';

interface AuthContextType {
  user: any | null;
  signUp: (email: string, password: string, metadata: { name: string; surname: string; cell_number: string }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<any | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Get initial user from local storage
    const currentUser = authService.getCurrentUser();
    setUserState(currentUser);
    if (currentUser) {
      dispatch(setUser(currentUser));
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const signUp = async (email: string, password: string, metadata: { name: string; surname: string; cell_number: string }) => {
    const { error } = await authService.signUp(email, password, metadata);
    if (!error) {
      const newUser = authService.getCurrentUser();
      setUserState(newUser);
      if (newUser) {
        dispatch(setUser(newUser));
      }
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signIn(email, password);
    if (!error) {
      const currentUser = authService.getCurrentUser();
      setUserState(currentUser);
      if (currentUser) {
        dispatch(setUser(currentUser));
      }
    }
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
    setUserState(null);
    dispatch(logout());
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

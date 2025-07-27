import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  image: string;
  seller: string;
  location: string;
  rating: number;
  addedAt: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (product: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Omit<FavoriteItem, 'addedAt'>) => void;
  clearFavorites: () => void;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export { FavoritesContext };

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      
      if (user?.role === 'buyer') {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      }
      
      setIsLoading(false);
    };
    
    loadFavorites();
  }, [user]);

  // Save favorites to localStorage when favorites change
  useEffect(() => {
    if (user?.role === 'buyer' && !isLoading) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user, isLoading]);

  // Clear favorites when user logs out
  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      setFavorites([]);
    }
  }, [user]);

  const addToFavorites = (product: Omit<FavoriteItem, 'addedAt'>) => {
    const favoriteItem: FavoriteItem = {
      ...product,
      addedAt: new Date().toISOString()
    };
    
    setFavorites(prevFavorites => {
      const exists = prevFavorites.find(item => item.id === product.id);
      if (exists) {
        return prevFavorites; // Don't add duplicates
      }
      return [favoriteItem, ...prevFavorites]; // Add to beginning
    });
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item.id !== productId)
    );
  };

  const isFavorite = (productId: number) => {
    return favorites.some(item => item.id === productId);
  };

  const toggleFavorite = (product: Omit<FavoriteItem, 'addedAt'>) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    isLoading
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

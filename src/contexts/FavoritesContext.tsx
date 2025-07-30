import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export { FavoritesContext };

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      
      setIsLoading(false);
    };
    
    loadFavorites();
  }, []);

  // Save favorites to localStorage when favorites change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoading]);

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

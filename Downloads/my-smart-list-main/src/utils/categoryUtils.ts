import { ItemCategory } from '@/store/slices/shoppingListSlice';
import { 
  ShoppingBasket, 
  Milk, 
  Beef, 
  Croissant, 
  Wine, 
  Snowflake, 
  Cookie, 
  Home, 
  Sparkles, 
  MoreHorizontal 
} from 'lucide-react';

export const categoryConfig: Record<ItemCategory, { label: string; icon: typeof ShoppingBasket; className: string }> = {
  groceries: { label: 'Groceries', icon: ShoppingBasket, className: 'category-groceries' },
  dairy: { label: 'Dairy', icon: Milk, className: 'category-dairy' },
  meat: { label: 'Meat', icon: Beef, className: 'category-meat' },
  bakery: { label: 'Bakery', icon: Croissant, className: 'category-bakery' },
  beverages: { label: 'Beverages', icon: Wine, className: 'category-beverages' },
  frozen: { label: 'Frozen', icon: Snowflake, className: 'category-frozen' },
  snacks: { label: 'Snacks', icon: Cookie, className: 'category-snacks' },
  household: { label: 'Household', icon: Home, className: 'category-household' },
  personal_care: { label: 'Personal Care', icon: Sparkles, className: 'category-personal-care' },
  other: { label: 'Other', icon: MoreHorizontal, className: 'category-other' },
};

export const getCategoryConfig = (category: ItemCategory) => {
  return categoryConfig[category] || categoryConfig.other;
};

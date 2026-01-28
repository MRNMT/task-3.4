import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingList } from '@/store/slices/shoppingListSlice';
import { getCategoryConfig } from '@/utils/categoryUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Share2, 
  ShoppingBag,
  CheckCircle2,
  Circle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface ShoppingListCardProps {
  list: ShoppingList;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

const ShoppingListCard = ({ list, onSelect, onEdit, onDelete, onShare }: ShoppingListCardProps) => {
  const completedCount = list.items.filter(item => item.isCompleted).length;
  const totalCount = list.items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Get unique categories from items
  const categories = [...new Set(list.items.map(item => item.category))].slice(0, 3);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="card-hover cursor-pointer overflow-hidden group"
        onClick={onSelect}
      >
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary"
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-display truncate pr-2">
                {list.name}
              </CardTitle>
              {list.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {list.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(); }}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          {/* Items preview */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              <span>{totalCount} {totalCount === 1 ? 'item' : 'items'}</span>
            </div>
            {totalCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">{completedCount}/{totalCount}</span>
              </div>
            )}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => {
                const config = getCategoryConfig(category);
                return (
                  <Badge 
                    key={category} 
                    variant="secondary"
                    className={`${config.className} border-0 text-xs font-medium`}
                  >
                    <config.icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Preview of first few items */}
          {list.items.length > 0 && (
            <div className="space-y-1">
              {list.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  {item.isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`truncate ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {item.name}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-muted-foreground text-xs">×{item.quantity}</span>
                  )}
                </div>
              ))}
              {list.items.length > 3 && (
                <p className="text-xs text-muted-foreground pl-5">
                  +{list.items.length - 3} more items
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              {format(new Date(list.createdAt), 'MMM d, yyyy')}
            </span>
            {list.isShared && (
              <Badge variant="outline" className="text-xs">
                <Share2 className="h-3 w-3 mr-1" />
                Shared
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShoppingListCard;

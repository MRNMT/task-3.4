import { motion } from 'framer-motion';
import { ShoppingItem } from '@/store/slices/shoppingListSlice';
import { getCategoryConfig } from '@/utils/categoryUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreVertical, 
  Trash2, 
  Edit2,
  ImageIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ShoppingItemRow = ({ item, onToggleComplete, onEdit, onDelete }: ShoppingItemRowProps) => {
  const config = getCategoryConfig(item.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`flex items-center gap-4 p-4 rounded-xl border bg-card transition-all group ${
        item.isCompleted ? 'bg-muted/50 border-muted' : 'border-border hover:border-primary/30'
      }`}
    >
      {/* Checkbox */}
      <Checkbox
        checked={item.isCompleted}
        onCheckedChange={onToggleComplete}
        className="h-5 w-5"
      />

      {/* Image */}
      {item.imageUrl ? (
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <ImageIcon className="w-5 h-5 text-muted-foreground" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
            {item.name}
          </span>
          {item.quantity > 1 && (
            <Badge variant="secondary" className="text-xs">
              ×{item.quantity}
            </Badge>
          )}
        </div>
        {item.notes && (
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {item.notes}
          </p>
        )}
      </div>

      {/* Category badge */}
      <Badge 
        variant="secondary"
        className={`${config.className} border-0 text-xs font-medium hidden sm:flex`}
      >
        <config.icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card">
          <DropdownMenuItem onClick={onEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default ShoppingItemRow;

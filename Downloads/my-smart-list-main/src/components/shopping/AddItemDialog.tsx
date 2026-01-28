import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ItemCategory } from '@/store/slices/shoppingListSlice';
import { categoryConfig } from '@/utils/categoryUtils';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(999, 'Quantity is too high'),
  notes: z.string().max(500, 'Notes are too long').optional(),
  category: z.string() as z.ZodType<ItemCategory>,
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    quantity: number;
    notes?: string;
    category: ItemCategory;
    imageUrl?: string;
  }) => Promise<void>;
  editData?: {
    name: string;
    quantity: number;
    notes?: string;
    category: ItemCategory;
    imageUrl?: string;
  };
  isEdit?: boolean;
}

const AddItemDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editData,
  isEdit = false 
}: AddItemDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: editData || { 
      name: '', 
      quantity: 1, 
      notes: '', 
      category: 'other' as ItemCategory,
      imageUrl: '' 
    },
  });

  const selectedCategory = watch('category');

  const handleFormSubmit = async (data: ItemFormData) => {
    setIsLoading(true);
    try {
      await onSubmit({
        name: data.name,
        quantity: data.quantity,
        category: data.category,
        imageUrl: data.imageUrl || undefined,
        notes: data.notes || undefined,
      });
      reset();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? 'Edit Item' : 'Add Item'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Update the item details.'
              : 'Add a new item to your shopping list.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="e.g., Milk"
                className="h-11"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Qty</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={999}
                className="h-11"
                {...register('quantity', { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value: ItemCategory) => setValue('category', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className="h-4 w-4" />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add notes..."
              className="resize-none"
              rows={2}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              className="h-11"
              {...register('imageUrl')}
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? 'Saving...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {isEdit ? 'Save Changes' : 'Add Item'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;

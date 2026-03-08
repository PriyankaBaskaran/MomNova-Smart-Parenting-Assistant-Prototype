'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBaby } from '@/contexts/baby-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Baby } from 'lucide-react';

const babySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().optional(),
  feedingType: z.string().optional(),
  notes: z.string().optional(),
});

type BabyFormData = z.infer<typeof babySchema>;

interface BabyProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BabyProfileForm({ open, onOpenChange }: BabyProfileFormProps) {
  const { addBaby } = useBaby();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BabyFormData>({
    resolver: zodResolver(babySchema),
  });

  const gender = watch('gender');
  const feedingType = watch('feedingType');

  const onSubmit = async (data: BabyFormData) => {
    try {
      setIsSubmitting(true);
      await addBaby(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Baby className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Baby Profile</DialogTitle>
              <DialogDescription>
                Add your baby's information to get started
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Baby's Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Aarav"
              {...register('name')}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register('dateOfBirth')}
              disabled={isSubmitting}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender (Optional)</Label>
            <Select
              value={gender}
              onValueChange={(value) => setValue('gender', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedingType">Feeding Type (Optional)</Label>
            <Select
              value={feedingType}
              onValueChange={(value) => setValue('feedingType', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select feeding type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breastfeeding">Breastfeeding</SelectItem>
                <SelectItem value="formula">Formula</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Any additional notes..."
              {...register('notes')}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Profile'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useId, useState } from 'react';
import { CircleAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService } from '@/lib/api.service';

interface DeleteConfirmationModalProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => Promise<void>;
  confirmPlaceholder?: string;
}

export default function DeleteConfirmationModal({
  trigger,
  title,
  description,
  confirmText,
  onConfirm,
  confirmPlaceholder,
}: DeleteConfirmationModalProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (inputValue !== confirmText) return;
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 backdrop-blur-sm border border-zinc-400/60 dark:border-zinc-600/20 rounded-2xl shadow-[4px_8px_12px_2px_rgba(0,0,0,0.2)]" style={{ backgroundColor: 'rgb(53, 53, 53)' }}>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center text-xl font-semibold text-zinc-100">
              {title}
            </DialogTitle>
            <DialogDescription className="sm:text-center text-zinc-300 text-left pt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
          <div className="*:not-first:mt-2">
            <Label htmlFor={id} className="text-zinc-200">Confirmation</Label>
            <Input
              id={id}
              type="text"
              placeholder={confirmPlaceholder || `Type ${confirmText} to confirm`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-zinc-800 border-zinc-600 text-zinc-200 focus:ring-2 focus:ring-white/50 rounded-xl"
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1 rounded-xl border-zinc-600/40 bg-transparent text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100 px-6" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white border-0 px-6"
              disabled={inputValue !== confirmText || loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
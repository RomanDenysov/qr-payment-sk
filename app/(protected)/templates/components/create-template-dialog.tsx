'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

interface CreateTemplateDialogProps {
  children: React.ReactNode;
  onCreateTemplate: (template: {
    name: string;
    description: string;
    amount: string;
    iban: string;
    color: string;
    icon: string;
  }) => void;
}

export function CreateTemplateDialog({
  children,
  onCreateTemplate,
}: CreateTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [iban, setIban] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('💳');

  const colors = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
  ];

  const icons = ['💳', '🍽️', '🎟️', '👤', '🏪', '🎯', '📱', '💰'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !description || !amount || !iban) {
      toast.error('Please fill in all required fields');
      return;
    }

    onCreateTemplate({
      name,
      description,
      amount,
      iban,
      color,
      icon,
    });

    // Reset form
    setName('');
    setDescription('');
    setAmount('');
    setIban('');
    setColor('#3b82f6');
    setIcon('💳');
    setOpen(false);
    toast.success('Template created successfully');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Restaurant Payment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Description *</Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this template"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-amount">Amount (€) *</Label>
            <Input
              id="template-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-iban">IBAN *</Label>
            <Input
              id="template-iban"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="SK89 0200 0000 0000 0000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 ${color === c ? 'border-gray-900' : 'border-gray-300'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex gap-2">
              {icons.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`h-8 w-8 rounded border text-lg ${icon === i ? 'border-gray-900 bg-gray-100' : 'border-gray-300'}`}
                  onClick={() => setIcon(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Template
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

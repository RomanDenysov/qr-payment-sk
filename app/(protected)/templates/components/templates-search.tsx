'use client';

import { SearchIcon } from 'lucide-react';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

interface TemplatesSearchProps {
  searchQuery: string;
  sortBy: 'name' | 'created' | 'usage';
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'name' | 'created' | 'usage') => void;
}

export function TemplatesSearch({
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
}: TemplatesSearchProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="created">Date Created</SelectItem>
          <SelectItem value="usage">Usage Count</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

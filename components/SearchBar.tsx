"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { JSX } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search campaigns...",
}: SearchBarProps): JSX.Element {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
      <Input
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="pl-10 bg-gray-950/50 border-green-900/30 text-green-50 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20"
      />
    </div>
  );
}

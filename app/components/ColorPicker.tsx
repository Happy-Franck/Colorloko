"use client";

import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onGenerate: () => void;
}

export function ColorPicker({ color, onChange, onGenerate }: ColorPickerProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onGenerate();
    }
  };

  const handleClear = () => {
    onChange("#FFFFFF");
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <HexColorPicker onChange={onChange} color={color} />
      <div 
        className="w-16 h-16 rounded-lg transition-colors duration-300 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
        style={{ backgroundColor: color }}
      ></div>
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="font-mono text-lg pr-8"
          />
          {color !== "#FFFFFF" && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Effacer la couleur"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={onGenerate}>Generate</Button>
      </div>
    </div>
  );
} 
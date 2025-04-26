"use client";
import { ColorPicker } from "./components/ColorPicker";
import { StyleGroup } from "./components/styleGroup";
import { useState } from "react";

export default function Home() {
  const [color, setColor] = useState("#FF0000");
  const [showGroups, setShowGroups] = useState(false);
  const [generationKey, setGenerationKey] = useState(0);
  const [generatedColor, setGeneratedColor] = useState<string | null>(null);

  const handleGenerate = () => {
    setShowGroups(false);
    setTimeout(() => {
      setGeneratedColor(color);
      setGenerationKey(prev => prev + 1);
      setShowGroups(true);
    }, 100);
  };

  return (
    <div className="min-h-screen container mx-auto p-8">
      <div className="flex flex-col items-center gap-8">
        <ColorPicker 
          color={color} 
          onChange={setColor} 
          onGenerate={handleGenerate}
        />
      </div>
      {showGroups && generatedColor && (
        <StyleGroup key={generationKey} selectedColor={generatedColor} />
      )}
    </div>
  );
}

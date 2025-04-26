"use client";

import { ColorPaletteGenerator } from "@/components/color-palette";

export default function Test() {
  return (
    <div>
      <ColorPaletteGenerator 
        initialColor="#3B82F6"
        onPaletteSelect={(palette) => {
            console.log(palette);
        }}
        />
    </div>
  );
}
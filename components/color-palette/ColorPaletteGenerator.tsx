"use client";

import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import chroma from "chroma-js";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

// Types pour les palettes de couleurs
type ColorPalette = {
  name: string;
  colors: string[];
  description: string;
};

// Styles de palette prédéfinis
const PALETTE_STYLES: ColorPalette[] = [
  {
    name: "Monochrome",
    description: "Variations d'une seule couleur",
    colors: [],
  },
  {
    name: "Complémentaire",
    description: "Couleurs opposées sur le cercle chromatique",
    colors: [],
  },
  {
    name: "Triade",
    description: "Trois couleurs équidistantes sur le cercle chromatique",
    colors: [],
  },
  {
    name: "Tétrade",
    description: "Quatre couleurs formant un rectangle sur le cercle chromatique",
    colors: [],
  },
  {
    name: "Analogique",
    description: "Couleurs adjacentes sur le cercle chromatique",
    colors: [],
  },
  {
    name: "Nuances",
    description: "Variations de saturation et luminosité",
    colors: [],
  },
];

interface ColorPaletteGeneratorProps {
  initialColor?: string;
  onPaletteSelect?: (palette: ColorPalette) => void;
}

export function ColorPaletteGenerator({
  initialColor = "#3B82F6",
  onPaletteSelect,
}: ColorPaletteGeneratorProps) {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [hexInput, setHexInput] = useState(initialColor);
  const [generatedPalettes, setGeneratedPalettes] = useState<ColorPalette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedPaletteName, setCopiedPaletteName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mettre à jour l'input lorsque la couleur sélectionnée change
  useEffect(() => {
    setHexInput(selectedColor);
  }, [selectedColor]);

  // Valider et mettre à jour la couleur à partir de l'input
  const handleHexInputChange = (value: string) => {
    setHexInput(value);
    
    // Valider si c'est une couleur hexadécimale valide
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setSelectedColor(value);
    }
  };

  // Générer les palettes de couleurs
  const generatePalettes = () => {
    setIsGenerating(true);
    
    const baseColor = chroma(selectedColor);
    const h = baseColor.get("hsl.h");
    const s = baseColor.get("hsl.s");
    const l = baseColor.get("hsl.l");

    const palettes = PALETTE_STYLES.map((style) => {
      let colors: string[] = [];

      switch (style.name) {
        case "Monochrome":
          colors = [
            baseColor.hex(),
            baseColor.darken(1.5).hex(),
            baseColor.darken(0.75).hex(),
            baseColor.brighten(0.75).hex(),
            baseColor.brighten(1.5).hex(),
          ];
          break;
        case "Complémentaire":
          colors = [
            baseColor.hex(),
            baseColor.set("hsl.h", (h + 180) % 360).hex(),
          ];
          break;
        case "Triade":
          colors = [
            baseColor.hex(),
            baseColor.set("hsl.h", (h + 120) % 360).hex(),
            baseColor.set("hsl.h", (h + 240) % 360).hex(),
          ];
          break;
        case "Tétrade":
          colors = [
            baseColor.hex(),
            baseColor.set("hsl.h", (h + 90) % 360).hex(),
            baseColor.set("hsl.h", (h + 180) % 360).hex(),
            baseColor.set("hsl.h", (h + 270) % 360).hex(),
          ];
          break;
        case "Analogique":
          colors = [
            baseColor.set("hsl.h", (h - 30 + 360) % 360).hex(),
            baseColor.hex(),
            baseColor.set("hsl.h", (h + 30) % 360).hex(),
          ];
          break;
        case "Nuances":
          colors = [
            baseColor.hex(),
            baseColor.set("hsl.s", Math.max(0, s - 0.3)).hex(),
            baseColor.set("hsl.s", Math.min(1, s + 0.3)).hex(),
            baseColor.set("hsl.l", Math.max(0, l - 0.3)).hex(),
            baseColor.set("hsl.l", Math.min(1, l + 0.3)).hex(),
          ];
          break;
      }

      return {
        ...style,
        colors,
      };
    });

    setGeneratedPalettes(palettes);
    setSelectedPalette(palettes[0]);
    setIsGenerating(false);
  };

  // Copier une couleur dans le presse-papiers
  const copyColor = async (color: string, paletteName?: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setCopiedPaletteName(paletteName || null);
      setTimeout(() => {
        setCopiedColor(null);
        setCopiedPaletteName(null);
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  // Télécharger une palette
  const downloadPalette = (palette: ColorPalette) => {
    const colorsWithNames = palette.colors.reduce((acc, color, index) => {
      acc[`color-${index + 1}`] = color;
      return acc;
    }, {} as Record<string, string>);

    const jsonData = {
      name: palette.name,
      colors: colorsWithNames,
      baseColor: selectedColor,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, "-")}-palette.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sélecteur de couleur */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sélectionnez une couleur</h2>
          <div className="flex flex-col items-center">
            <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
            <div className="mt-4 flex items-center gap-2 w-full max-w-xs">
              <div
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  className="font-mono pr-8"
                  placeholder="#000000"
                />
                {hexInput && (
                  <button
                    onClick={() => {
                      setHexInput("");
                      setSelectedColor(initialColor);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => copyColor(selectedColor)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Copier la couleur"
              >
                {copiedColor === selectedColor && !copiedPaletteName ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <Button 
              onClick={generatePalettes} 
              className="mt-4 w-full max-w-xs"
              disabled={isGenerating}
            >
              {isGenerating ? "Génération..." : "Générer les palettes"}
            </Button>
          </div>
        </div>

        {/* Palettes générées */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Palettes générées</h2>
          <div className="space-y-6">
            {generatedPalettes.map((palette) => (
              <div
                key={palette.name}
                onClick={() => {
                    setSelectedPalette(palette);
                    onPaletteSelect?.(palette);
                  }}
                className={`p-4 rounded-lg border ${
                  selectedPalette?.name === palette.name
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{palette.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPalette(palette)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {palette.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="group relative"
                      onClick={() => copyColor(color, palette.name)}
                    >
                      <div
                        className="w-12 h-12 rounded-md shadow-sm cursor-pointer transition-transform hover:scale-105"
                        style={{ backgroundColor: color }}
                      />
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {color}
                      </div>
                      {copiedColor === color && copiedPaletteName === palette.name && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg text-xs font-medium">
                          Copié
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
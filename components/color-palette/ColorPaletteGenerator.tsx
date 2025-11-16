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
        case "Monochrome": {
          colors = [
            baseColor.darken(1.5).hex(),
            baseColor.darken(0.75).hex(),
            baseColor.hex(),
            baseColor.brighten(0.75).hex(),
            baseColor.brighten(1.5).hex(),
          ];
          break;
        }
        case "Complémentaire": {
          const complementary = baseColor.set("hsl.h", (h + 180) % 360);
          colors = [
            baseColor.brighten(0.8).hex(),
            baseColor.hex(),
            baseColor.darken(0.8).hex(),
            complementary.hex(),
            complementary.darken(0.8).hex(),
          ];
          break;
        }
        case "Triade": {
          const triad1 = baseColor.set("hsl.h", (h + 120) % 360);
          const triad2 = baseColor.set("hsl.h", (h + 240) % 360);
          colors = [
            baseColor.brighten(0.8).hex(),
            baseColor.hex(),
            triad1.hex(),
            triad2.hex(),
            triad2.darken(0.8).hex(),
          ];
          break;
        }
        case "Tétrade": {
          const c2 = baseColor.set("hsl.h", (h + 90) % 360);
          const c3 = baseColor.set("hsl.h", (h + 180) % 360);
          const c4 = baseColor.set("hsl.h", (h + 270) % 360);
          colors = [
            baseColor.hex(),
            c2.hex(),
            c3.hex(),
            c4.hex(),
            baseColor.brighten(0.9).hex(),
          ];
          break;
        }
        case "Analogique": {
          const a1 = baseColor.set("hsl.h", (h - 30 + 360) % 360);
          const a2 = baseColor.set("hsl.h", (h + 30) % 360);
          colors = [
            baseColor.darken(0.7).hex(),
            a1.hex(),
            baseColor.hex(),
            a2.hex(),
            baseColor.brighten(0.7).hex(),
          ];
          break;
        }
        case "Nuances": {
          colors = [
            baseColor.set("hsl.l", Math.max(0, l - 0.3)).hex(),
            baseColor.set("hsl.s", Math.max(0, s - 0.3)).hex(),
            baseColor.hex(),
            baseColor.set("hsl.s", Math.min(1, s + 0.3)).hex(),
            baseColor.set("hsl.l", Math.min(1, l + 0.3)).hex(),
          ];
          break;
        }
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
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-10 items-start">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {generatedPalettes.map((palette) => (
              <div
                key={palette.name}
                onClick={() => {
                  setSelectedPalette(palette);
                  onPaletteSelect?.(palette);
                }}
                className={`group cursor-pointer rounded-3xl border shadow-sm h-[360px] ${
                  selectedPalette?.name === palette.name
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex flex-col h-full p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm tracking-wide">
                      {palette.name}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPalette(palette);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {palette.description}
                  </p>

                  <div className="relative rounded-2xl bg-gray-100 dark:bg-gray-900 p-1 flex-1">
                    <div className="flex h-64 flex-col overflow-hidden rounded-2xl">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            copyColor(color, palette.name);
                          }}
                          style={{ backgroundColor: color }}
                          className="relative flex flex-1 min-h-[48px] items-center justify-center"
                        >
                          <span className="text-xs font-semibold tracking-wide text-white">
                            {color}
                          </span>
                          {copiedColor === color && copiedPaletteName === palette.name && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-[10px] font-semibold uppercase tracking-wide text-white">
                              Copié
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
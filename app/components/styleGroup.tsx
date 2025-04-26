"use client";

import chroma from "chroma-js";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface StyleGroupProps {
    selectedColor: string;
}

interface Style {
    name: string;
    colors: string[];
}

export function StyleGroup({ selectedColor }: StyleGroupProps) {
    const [mounted, setMounted] = useState(false);
    const [copiedColorId, setCopiedColorId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleCopyColor = async (color: string, colorId: string) => {
        try {
            await navigator.clipboard.writeText(color);
            setCopiedColorId(colorId);
            setTimeout(() => setCopiedColorId(null), 2000);
        } catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
    };

    const handleDownload = async (style: Style) => {
        try {
            const colorsWithNames = style.colors.reduce((acc, color, index) => {
                acc[`color-${index + 1}`] = color;
                return acc;
            }, {} as Record<string, string>);

            const jsonData = {
                name: style.name,
                colors: colorsWithNames,
                baseColor: selectedColor
            };
            
            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${style.name.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Erreur lors de l\'export:', err);
        }
    };

    const baseColor = chroma(selectedColor);
    
    const styles: Style[] = [
        {
            name: "Semblable",
            colors: [
                baseColor.hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 20) % 360).hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') - 20 + 360) % 360).hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 40) % 360).hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') - 40 + 360) % 360).hex()
            ]
        },
        {
            name: "Monochrome",
            colors: [
                baseColor.darken(2).hex(),
                baseColor.darken(1).hex(),
                baseColor.hex(),
                baseColor.brighten(1).hex(),
                baseColor.brighten(2).hex()
            ]
        },
        {
            name: "Triade",
            colors: [
                baseColor.hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 120) % 360).hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 240) % 360).hex()
            ]
        },
        {
            name: "Nuance",
            colors: [
                baseColor.set('hsl.s', 1.0).hex(),
                baseColor.set('hsl.s', 0.8).hex(),
                baseColor.set('hsl.s', 0.6).hex(),
                baseColor.set('hsl.s', 0.4).hex(),
                baseColor.set('hsl.s', 0.2).hex()
            ]
        },
        {
            name: "Carré",
            colors: [
                baseColor.hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 90) % 360).hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 180) % 360).hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 270) % 360).hex()
            ]
        },
        {
            name: "Composite",
            colors: [
                baseColor.hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 30) % 360).hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 150) % 360).hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 210) % 360).hex()
            ]
        },
        {
            name: "Complémentaire",
            colors: [
                baseColor.hex(),
                baseColor.set('hsl.h', (baseColor.get('hsl.h') + 180) % 360).hex()
            ]
        },
        {
            name: "Luminosite",
            colors: [
                baseColor.set('hsl.l', 0.55).hex(),
                baseColor.set('hsl.l', 0.65).hex(),
                baseColor.set('hsl.l', 0.75).hex(),
                baseColor.set('hsl.l', 0.85).hex(),
                baseColor.set('hsl.l', 0.95).hex(),
            ]
        },
    ];
    

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styles.map((style, groupIndex) => (
                <div key={groupIndex} className="p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-semibold">{style.name}</h4>
                        <button
                            onClick={() => handleDownload(style)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Télécharger la palette"
                        >
                            <Download className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {style.colors.map((color, index) => {
                            const colorId = `${style.name}-${index}`;
                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <div 
                                        className="w-full h-[30px] rounded-lg transition-transform hover:scale-105 cursor-pointer relative"
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleCopyColor(color, colorId)}
                                    >
                                        {copiedColorId === colorId && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-sm font-mono px-2 py-1 rounded bg-white/90 dark:bg-gray-800/90 shadow-sm">Copié !</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
} 
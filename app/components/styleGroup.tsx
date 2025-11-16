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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style, groupIndex) => (
                <div
                    key={groupIndex}
                    className="flex flex-col items-center gap-3"
                >
                    <div className="flex items-center justify-between w-full px-1 text-xs font-medium text-gray-400 dark:text-gray-500">
                        <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                        <span className="uppercase tracking-wide text-[0.65rem]">{style.name}</span>
                        <button
                            onClick={() => handleDownload(style)}
                            className="inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Télécharger la palette ok"
                        >
                            <Download className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="w-full rounded-3xl bg-gray-100/80 dark:bg-gray-900/70 p-3 shadow-md shadow-gray-200/80 dark:shadow-black/40 transition-transform duration-200 hover:-translate-y-1">
                        <div className="flex flex-col overflow-hidden rounded-2xl">
                            {style.colors.map((color, index) => {
                                const colorId = `${style.name}-${index}`;
                                const textColor = chroma.contrast(color, "white") > 4.5 ? "#FFFFFF" : "#111827";
                                const isFirst = index === 0;
                                const isLast = index === style.colors.length - 1;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleCopyColor(color, colorId)}
                                        className="relative w-full h-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 focus-visible:ring-gray-300 dark:focus-visible:ring-offset-gray-900 dark:focus-visible:ring-gray-600 transition-transform duration-150 hover:scale-[1.01]"
                                        style={{
                                            backgroundColor: color,
                                            borderTopLeftRadius: isFirst ? 16 : 0,
                                            borderTopRightRadius: isFirst ? 16 : 0,
                                            borderBottomLeftRadius: isLast ? 16 : 0,
                                            borderBottomRightRadius: isLast ? 16 : 0,
                                            color: textColor,
                                        }}
                                    >
                                        <span className="pointer-events-none select-none text-xs font-mono tracking-wide">
                                            {color.toUpperCase()}
                                        </span>
                                        {copiedColorId === colorId && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[0.65rem] font-mono px-2 py-1 rounded-full bg-white/90 text-gray-900 shadow-sm">
                                                    Copié !
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
 
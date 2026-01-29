"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './MedellinMap.module.css';

interface Zone {
    id: string;
    name: string;
    status: 'available' | 'occupied';
    business?: string;
    neighborhoods: string[];
    coordinates: { x: number; y: number; width: number; height: number };
}

const zones: Zone[] = [
    {
        id: 'poblado',
        name: 'El Poblado',
        status: 'occupied',
        business: 'Pizzería Don Carlo',
        neighborhoods: ['El Poblado', 'Manila', 'Patio Bonito'],
        coordinates: { x: 450, y: 350, width: 120, height: 100 }
    },
    {
        id: 'laureles',
        name: 'Laureles - Estadio',
        status: 'available',
        neighborhoods: ['Laureles', 'Estadio', 'Los Colores'],
        coordinates: { x: 280, y: 280, width: 140, height: 110 }
    },
    {
        id: 'belen',
        name: 'Belén',
        status: 'available',
        neighborhoods: ['Belén', 'Fátima', 'Rosales'],
        coordinates: { x: 200, y: 400, width: 130, height: 120 }
    },
    {
        id: 'envigado',
        name: 'Envigado',
        status: 'available',
        neighborhoods: ['Envigado Centro', 'Zona Sur'],
        coordinates: { x: 500, y: 480, width: 110, height: 90 }
    },
    {
        id: 'sabaneta',
        name: 'Sabaneta',
        status: 'occupied',
        business: 'Gym FitZone',
        neighborhoods: ['Sabaneta', 'Cañaveralejo'],
        coordinates: { x: 420, y: 580, width: 100, height: 80 }
    },
    {
        id: 'itagui',
        name: 'Itagüí',
        status: 'available',
        neighborhoods: ['Itagüí Centro', 'San Pío'],
        coordinates: { x: 300, y: 550, width: 110, height: 100 }
    },
    {
        id: 'bello',
        name: 'Bello',
        status: 'available',
        neighborhoods: ['Bello Centro', 'Niquia', 'Fabricato'],
        coordinates: { x: 350, y: 80, width: 140, height: 120 }
    },
    {
        id: 'robledo',
        name: 'Robledo',
        status: 'available',
        neighborhoods: ['Robledo', 'Pajarito', 'Altavista'],
        coordinates: { x: 150, y: 250, width: 120, height: 130 }
    },
    {
        id: 'aranjuez',
        name: 'Aranjuez',
        status: 'available',
        neighborhoods: ['Aranjuez', 'Manrique'],
        coordinates: { x: 500, y: 180, width: 110, height: 100 }
    },
    {
        id: 'castilla',
        name: 'Castilla',
        status: 'available',
        neighborhoods: ['Castilla', 'Doce de Octubre'],
        coordinates: { x: 280, y: 150, width: 100, height: 90 }
    }
];

export default function MedellinMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredZone, setHoveredZone] = useState<Zone | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let pulseOffset = 0;

        const drawMap = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background grid
            ctx.strokeStyle = 'rgba(158, 0, 96, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 40) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }

            // Draw zones
            zones.forEach(zone => {
                const isHovered = hoveredZone?.id === zone.id;
                const isAvailable = zone.status === 'available';

                // Zone background
                ctx.fillStyle = isAvailable
                    ? `rgba(0, 255, 136, ${isHovered ? 0.25 : 0.15})`
                    : 'rgba(50, 50, 50, 0.4)';

                ctx.fillRect(
                    zone.coordinates.x,
                    zone.coordinates.y,
                    zone.coordinates.width,
                    zone.coordinates.height
                );

                // Zone border
                ctx.strokeStyle = isAvailable
                    ? `rgba(0, 255, 136, ${isHovered ? 1 : 0.6})`
                    : 'rgba(100, 100, 100, 0.5)';
                ctx.lineWidth = isHovered ? 3 : 2;

                // Pulse effect for available zones
                if (isAvailable && !isHovered) {
                    const pulse = Math.sin(pulseOffset + zones.indexOf(zone) * 0.5) * 0.3 + 0.7;
                    ctx.strokeStyle = `rgba(0, 255, 136, ${pulse})`;
                }

                ctx.strokeRect(
                    zone.coordinates.x,
                    zone.coordinates.y,
                    zone.coordinates.width,
                    zone.coordinates.height
                );

                // Glow effect on hover
                if (isHovered) {
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = isAvailable ? '#00ff88' : '#9E0060';
                    ctx.strokeRect(
                        zone.coordinates.x,
                        zone.coordinates.y,
                        zone.coordinates.width,
                        zone.coordinates.height
                    );
                    ctx.shadowBlur = 0;
                }

                // Zone label
                ctx.fillStyle = isAvailable ? '#00ff88' : '#888';
                ctx.font = 'bold 14px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(
                    zone.name,
                    zone.coordinates.x + zone.coordinates.width / 2,
                    zone.coordinates.y + zone.coordinates.height / 2
                );

                // Status icon
                ctx.font = '20px Arial';
                ctx.fillText(
                    isAvailable ? '✓' : '🔒',
                    zone.coordinates.x + zone.coordinates.width / 2,
                    zone.coordinates.y + zone.coordinates.height / 2 + 25
                );
            });

            pulseOffset += 0.05;
            animationFrameRef.current = requestAnimationFrame(drawMap) as unknown as number;
        };

        drawMap();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [hoveredZone]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const zone = zones.find(z =>
            x >= z.coordinates.x &&
            x <= z.coordinates.x + z.coordinates.width &&
            y >= z.coordinates.y &&
            y <= z.coordinates.y + z.coordinates.height
        );

        setHoveredZone(zone || null);
        setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        setHoveredZone(null);
    };

    const handleClick = () => {
        if (hoveredZone) {
            if (hoveredZone.status === 'available') {
                alert(`¡${hoveredZone.name} está disponible! Agenda una llamada para reservar esta zona.`);
            } else {
                alert(`${hoveredZone.name} ya está ocupada por: ${hoveredZone.business}`);
            }
        }
    };

    return (
        <div className={styles.mapContainer}>
            <canvas
                ref={canvasRef}
                width={800}
                height={700}
                className={styles.canvas}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            />

            {hoveredZone && (
                <div
                    className={styles.tooltip}
                    style={{
                        left: tooltipPos.x + 15,
                        top: tooltipPos.y + 15
                    }}
                >
                    <h4>{hoveredZone.name}</h4>
                    <p className={styles.status}>
                        {hoveredZone.status === 'available' ? '✅ Disponible' : '🔒 Ocupada'}
                    </p>
                    {hoveredZone.business && (
                        <p className={styles.business}>Ocupada por: {hoveredZone.business}</p>
                    )}
                    <p className={styles.neighborhoods}>
                        Incluye: {hoveredZone.neighborhoods.join(', ')}
                    </p>
                    <p className={styles.action}>
                        {hoveredZone.status === 'available'
                            ? 'Click para reservar'
                            : 'Zona no disponible'}
                    </p>
                </div>
            )}
        </div>
    );
}

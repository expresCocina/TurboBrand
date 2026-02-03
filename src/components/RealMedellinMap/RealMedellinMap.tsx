"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { MEDELLIN_CENTER } from '@/data/medellinZones';
import styles from './RealMedellinMap.module.css';
import 'leaflet/dist/leaflet.css';

export interface ZoneData {
    id: string;
    name: string;
    type: 'comuna' | 'municipio';
    status: 'available' | 'occupied';
    coordinates: [number, number][][];
    metadata?: {
        occupiedDate?: string;
        notes?: string;
    };
}

// Component to fit bounds
function FitBounds() {
    const map = useMap();

    useEffect(() => {
        map.setView(MEDELLIN_CENTER, 12);
    }, [map]);

    return null;
}

export default function RealMedellinMap() {
    const [zones, setZones] = useState<ZoneData[]>([]);
    const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        // Detect mobile for performance optimizations
        setIsMobile(window.innerWidth < 768);

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch zones from API
    useEffect(() => {
        const fetchZones = async () => {
            try {
                const response = await fetch('/api/zones');
                const data = await response.json();

                if (data.success) {
                    setZones(data.zones);
                }
            } catch (error) {
                console.error('Error loading zones:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isMounted) {
            fetchZones();
        }
    }, [isMounted]);

    if (!isMounted || loading) {
        return (
            <div className={styles.mapPlaceholder}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                    <p>{loading ? 'Cargando zonas...' : 'Cargando mapa interactivo...'}</p>
                </div>
            </div>
        );
    }

    const getZoneColor = (zone: ZoneData) => {
        return zone.status === 'available' ? '#00ff88' : '#ef4444';
    };

    const getZoneFillColor = (zone: ZoneData) => {
        return zone.status === 'available'
            ? 'rgba(0, 255, 136, 0.3)'
            : 'rgba(239, 68, 68, 0.3)';
    };

    const handleReserve = (zone: ZoneData) => {
        if (zone.status === 'available') {
            // Aquí puedes agregar lógica para abrir modal de contacto
            alert(`¡Reserva ${zone.name}! Redirigiendo a contacto...`);
            // window.location.href = '#contacto';
        }
    };

    return (
        <div className={styles.mapWrapper}>
            <MapContainer
                center={MEDELLIN_CENTER}
                zoom={isMobile ? 11 : 12}
                className={styles.leafletMap}
                scrollWheelZoom={!isMobile}
                zoomControl={true}
                preferCanvas={true}
                attributionControl={false}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={18}
                    minZoom={isMobile ? 10 : 9}
                />
                <FitBounds />

                {zones.map((zone) => (
                    <Polygon
                        key={zone.id}
                        positions={zone.coordinates as LatLngExpression[][]}
                        pathOptions={{
                            color: getZoneColor(zone),
                            fillColor: getZoneFillColor(zone),
                            fillOpacity: 0.4,
                            weight: zone.status === 'occupied' ? 3 : 2,
                            opacity: 0.8
                        }}
                        eventHandlers={{
                            mouseover: (e) => {
                                const layer = e.target;
                                layer.setStyle({
                                    fillOpacity: 0.7,
                                    weight: 3
                                });
                                setSelectedZone(zone);
                            },
                            mouseout: (e) => {
                                const layer = e.target;
                                layer.setStyle({
                                    fillOpacity: 0.4,
                                    weight: 2
                                });
                            },
                            click: () => {
                                setSelectedZone(zone);
                            }
                        }}
                    >
                        <Popup className={styles.customPopup}>
                            <div className={styles.popupContent}>
                                <h3>{zone.name}</h3>
                                <div className={styles.zoneType}>
                                    {zone.type === 'comuna' ? '📍 Comuna' : '🏙️ Municipio'}
                                </div>

                                {zone.status === 'available' ? (
                                    <div className={styles.available}>
                                        <div className={styles.statusBadge}>
                                            ✅ <strong>DISPONIBLE</strong>
                                        </div>
                                        <p className={styles.statusText}>
                                            Esta zona está disponible para tu negocio.
                                            ¡Sé el primero en tu rubro aquí!
                                        </p>
                                        <button
                                            className={styles.reserveBtn}
                                            onClick={() => handleReserve(zone)}
                                        >
                                            Reservar Esta Zona
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.occupied}>
                                        <div className={styles.statusBadge}>
                                            🔒 <strong>OCUPADA</strong>
                                        </div>
                                        <p className={styles.statusText}>
                                            Esta zona ya tiene un negocio activo.
                                            Explora otras zonas disponibles.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Polygon>
                ))}
            </MapContainer>

            {/* Info Panel */}
            <div className={styles.infoPanel}>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>
                            {zones.filter(z => z.status === 'available').length}
                        </span>
                        <span className={styles.statLabel}>Zonas Disponibles</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>
                            {zones.filter(z => z.status === 'occupied').length}
                        </span>
                        <span className={styles.statLabel}>Zonas Ocupadas</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>{zones.length}</span>
                        <span className={styles.statLabel}>Total Zonas</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

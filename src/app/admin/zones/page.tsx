"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './page.module.css';

interface Zone {
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

interface Stats {
    total: number;
    available: number;
    occupied: number;
}

function AdminZonesPage() {
    const router = useRouter();
    const [zones, setZones] = useState<Zone[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, available: 0, occupied: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'available' | 'occupied'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newZone, setNewZone] = useState({
        id: '',
        name: '',
        type: 'comuna' as 'comuna' | 'municipio',
        coordinates: '[[]]'
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    useEffect(() => {
        loadZones();
    }, []);

    const loadZones = async () => {
        try {
            const response = await fetch('/api/zones');
            const data = await response.json();

            if (data.success) {
                setZones(data.zones);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error loading zones:', error);
            alert('Error al cargar las zonas');
        } finally {
            setLoading(false);
        }
    };

    const toggleZoneStatus = async (zoneId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'available' ? 'occupied' : 'available';

        try {
            const response = await fetch(`/api/zones/${zoneId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                loadZones(); // Recargar zonas
                alert(`Zona ${newStatus === 'available' ? 'liberada' : 'ocupada'} exitosamente`);
            }
        } catch (error) {
            console.error('Error updating zone:', error);
            alert('Error al actualizar la zona');
        }
    };

    const deleteZone = async (zoneId: string, zoneName: string) => {
        if (!confirm(`¿Estás seguro de eliminar "${zoneName}"?`)) return;

        try {
            const response = await fetch(`/api/zones/${zoneId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                loadZones();
                alert('Zona eliminada exitosamente');
            }
        } catch (error) {
            console.error('Error deleting zone:', error);
            alert('Error al eliminar la zona');
        }
    };

    const createZone = async () => {
        if (!newZone.id || !newZone.name) {
            alert('Por favor completa ID y Nombre');
            return;
        }

        try {
            const coordinates = JSON.parse(newZone.coordinates);

            const response = await fetch('/api/zones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: newZone.id,
                    name: newZone.name,
                    type: newZone.type,
                    status: 'available',
                    coordinates
                })
            });

            const data = await response.json();

            if (data.success) {
                loadZones();
                setShowAddModal(false);
                setNewZone({ id: '', name: '', type: 'comuna', coordinates: '[[]]' });
                alert('✅ Zona creada exitosamente');
            } else {
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating zone:', error);
            alert('Error al crear la zona. Verifica el formato de coordenadas.');
        }
    };

    const filteredZones = zones
        .filter(zone => {
            if (filter === 'all') return true;
            return zone.status === filter;
        })
        .filter(zone =>
            zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            zone.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Cargando...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>🗺️ Administración de Zonas</h1>
                    <p>Gestiona las zonas del mapa de Medellín</p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.addBtn}
                        onClick={() => setShowAddModal(true)}
                    >
                        ➕ Agregar Zona
                    </button>
                    <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                        title="Cerrar sesión"
                    >
                        🚪 Salir
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statNumber}>{stats.total}</span>
                    <span className={styles.statLabel}>Total Zonas</span>
                </div>
                <div className={`${styles.statCard} ${styles.available}`}>
                    <span className={styles.statNumber}>{stats.available}</span>
                    <span className={styles.statLabel}>Disponibles</span>
                </div>
                <div className={`${styles.statCard} ${styles.occupied}`}>
                    <span className={styles.statNumber}>{stats.occupied}</span>
                    <span className={styles.statLabel}>Ocupadas</span>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Buscar zona..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />

                <div className={styles.filterButtons}>
                    <button
                        className={filter === 'all' ? styles.active : ''}
                        onClick={() => setFilter('all')}
                    >
                        Todas
                    </button>
                    <button
                        className={filter === 'available' ? styles.active : ''}
                        onClick={() => setFilter('available')}
                    >
                        Disponibles
                    </button>
                    <button
                        className={filter === 'occupied' ? styles.active : ''}
                        onClick={() => setFilter('occupied')}
                    >
                        Ocupadas
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredZones.map(zone => (
                            <tr key={zone.id}>
                                <td><code>{zone.id}</code></td>
                                <td><strong>{zone.name}</strong></td>
                                <td>
                                    <span className={styles.typeBadge}>
                                        {zone.type === 'comuna' ? '📍 Comuna' : '🏙️ Municipio'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[zone.status]}`}>
                                        {zone.status === 'available' ? '✅ Disponible' : '🔒 Ocupada'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.toggleBtn}
                                            onClick={() => toggleZoneStatus(zone.id, zone.status)}
                                            title={zone.status === 'available' ? 'Marcar como ocupada' : 'Liberar zona'}
                                        >
                                            {zone.status === 'available' ? '🔒 Ocupar' : '✅ Liberar'}
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => deleteZone(zone.id, zone.name)}
                                            title="Eliminar zona"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredZones.length === 0 && (
                    <div className={styles.empty}>
                        No se encontraron zonas con los filtros aplicados
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <p>💡 <strong>Tip:</strong> Puedes agregar zonas con el botón "Agregar Zona"</p>
            </div>

            {/* Add Zone Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>➕ Agregar Nueva Zona</h2>

                        <div className={styles.formGroup}>
                            <label>ID *</label>
                            <input
                                type="text"
                                placeholder="ej: comuna-nueva"
                                value={newZone.id}
                                onChange={(e) => setNewZone({ ...newZone, id: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Nombre *</label>
                            <input
                                type="text"
                                placeholder="ej: Comuna Nueva"
                                value={newZone.name}
                                onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tipo</label>
                            <select
                                value={newZone.type}
                                onChange={(e) => setNewZone({ ...newZone, type: e.target.value as 'comuna' | 'municipio' })}
                            >
                                <option value="comuna">Comuna</option>
                                <option value="municipio">Municipio</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Coordenadas (JSON) *</label>
                            <textarea
                                placeholder='[[[6.25, -75.56], [6.26, -75.55], [6.25, -75.54], [6.24, -75.55], [6.25, -75.56]]]'
                                value={newZone.coordinates}
                                onChange={(e) => setNewZone({ ...newZone, coordinates: e.target.value })}
                                rows={4}
                            />
                            <small>Formato: Array de polígonos [[lat, lng], ...]</small>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className={styles.saveBtn}
                                onClick={createZone}
                            >
                                Crear Zona
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Wrap with protection
function ProtectedAdminZonesPage() {
    return (
        <ProtectedRoute>
            <AdminZonesPage />
        </ProtectedRoute>
    );
}

export default ProtectedAdminZonesPage;

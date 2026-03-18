"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './page.module.css';

const MEETING_TYPES = [
  "Consultoría Estratégica",
  "Pauta Digital",
  "Ingeniería Web",
  "Automatización",
  "Clases Personalizadas",
  "Otro",
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00",
];

function formatTimeLabel(t: string) {
  const [hh] = t.split(":");
  const h = parseInt(hh);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:00 ${ampm}`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function isWeekend(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 6;
}

interface Meeting {
  id: string;
  name: string;
  email: string;
  phone: string;
  meeting_type: string;
  message?: string;
  date: string;
  time: string;
  status: string;
  scheduled_by: string;
  meet_link?: string;
  created_at: string;
}

interface AdminForm {
  name: string;
  email: string;
  phone: string;
  meeting_type: string;
  message: string;
  date: string;
  time: string;
  internal_notes: string;
}

const INITIAL_FORM: AdminForm = {
  name: '', email: '', phone: '', meeting_type: '',
  message: '', date: '', time: '', internal_notes: '',
};

function AdminMeetingsPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [filterDate, setFilterDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdminForm>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Partial<AdminForm>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const loadMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meetings');
      const data = await res.json();
      if (data.success) setMeetings(data.meetings || []);
    } catch (e) {
      console.error('Error loading meetings:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const set = (field: keyof AdminForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Partial<AdminForm> = {};
    if (!form.name.trim())      e.name = 'Requerido';
    if (!form.email.trim())     e.email = 'Requerido';
    if (!form.phone.trim())     e.phone = 'Requerido';
    if (!form.meeting_type)     e.meeting_type = 'Requerido';
    if (!form.date)             e.date = 'Requerido';
    else if (form.date < getTodayStr()) e.date = 'Fecha en el pasado';
    else if (isWeekend(form.date))      e.date = 'Solo días hábiles';
    if (!form.time)             e.time = 'Requerido';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setFormLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        meeting_type: form.meeting_type,
        message: form.message || undefined,
        date: form.date,
        time: form.time,
        scheduled_by: 'admin',
      };
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Error al agendar la reunión.');
        return;
      }
      setFormSuccess(true);
      setForm(INITIAL_FORM);
      await loadMeetings();
      setTimeout(() => setFormSuccess(false), 4000);
    } catch {
      setFormError('Error de conexión. Intenta nuevamente.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleManualConfirm = async (id: string) => {
    if (!confirm('¿Seguro que quieres confirmar esta cita y enviar el correo al cliente?')) return;
    try {
      // Re-use the existing confirm route which updates DB and sends emails
      await fetch(`/api/meetings/confirm?id=${id}`);
      await loadMeetings();
    } catch (e) {
      console.error('Error confirming meeting:', e);
      alert('Hubo un error al confirmar la reunión.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres BORRAR definitivamente la reunión de ${name}? Esta acción NO se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/meetings?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error en el servidor al intentar borrar.');
      await loadMeetings();
    } catch (e) {
      console.error('Error deleting meeting:', e);
      alert('Hubo un error al borrar la reunión.');
    }
  };

  const filteredMeetings = meetings
    .filter((m) => {
      if (filterStatus !== 'all' && m.status !== filterStatus) return false;
      if (filterDate && m.date !== filterDate) return false;
      const term = searchTerm.toLowerCase();
      return m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term);
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando reuniones...</div>
      </div>
    );
  }

  const upcomingCount = meetings.filter((m) => m.date >= getTodayStr()).length;
  const confirmedCount = meetings.filter((m) => m.status === 'confirmed').length;
  const adminCount = meetings.filter((m) => m.scheduled_by === 'admin').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1>🗓️ Gestión de Reuniones</h1>
          <p>Agenda y administra todas las reuniones de Turbo Brand</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✖ Cerrar formulario' : '➕ Agendar reunión'}
          </button>
          <a href="/admin/zones" className={styles.navLink}>🗺️ Zonas</a>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
            🚪 Salir
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{meetings.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={`${styles.statCard} ${styles.upcoming}`}>
          <span className={styles.statNumber}>{upcomingCount}</span>
          <span className={styles.statLabel}>Próximas</span>
        </div>
        <div className={`${styles.statCard} ${styles.confirmed}`}>
          <span className={styles.statNumber}>{confirmedCount}</span>
          <span className={styles.statLabel}>Confirmadas</span>
        </div>
        <div className={`${styles.statCard} ${styles.admin}`}>
          <span className={styles.statNumber}>{adminCount}</span>
          <span className={styles.statLabel}>Por Admin</span>
        </div>
      </div>

      {/* Admin form */}
      {showForm && (
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>📝 Agendar reunión desde el panel</h2>
          {formSuccess && (
            <div className={styles.successBanner}>✅ ¡Reunión agendada! Se enviaron los correos de confirmación.</div>
          )}
          {formError && (
            <div className={styles.errorBanner}>⚠️ {formError}</div>
          )}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Nombre completo *</label>
                <input type="text" placeholder="Juan Pérez" value={form.name} onChange={(e) => set('name', e.target.value)} className={formErrors.name ? styles.inputError : ''} />
                {formErrors.name && <span className={styles.errMsg}>{formErrors.name}</span>}
              </div>
              <div className={styles.formGroup}>
                <label>Correo electrónico *</label>
                <input type="email" placeholder="juan@empresa.com" value={form.email} onChange={(e) => set('email', e.target.value)} className={formErrors.email ? styles.inputError : ''} />
                {formErrors.email && <span className={styles.errMsg}>{formErrors.email}</span>}
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Teléfono *</label>
                <input type="tel" placeholder="+57 300 000 0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={formErrors.phone ? styles.inputError : ''} />
                {formErrors.phone && <span className={styles.errMsg}>{formErrors.phone}</span>}
              </div>
              <div className={styles.formGroup}>
                <label>Tipo de reunión *</label>
                <select value={form.meeting_type} onChange={(e) => set('meeting_type', e.target.value)} className={formErrors.meeting_type ? styles.inputError : ''}>
                  <option value="">Selecciona...</option>
                  {MEETING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {formErrors.meeting_type && <span className={styles.errMsg}>{formErrors.meeting_type}</span>}
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Fecha *</label>
                <input type="date" min={getTodayStr()} value={form.date} onChange={(e) => set('date', e.target.value)} className={formErrors.date ? styles.inputError : ''} />
                {formErrors.date && <span className={styles.errMsg}>{formErrors.date}</span>}
              </div>
              <div className={styles.formGroup}>
                <label>Hora *</label>
                <select value={form.time} onChange={(e) => set('time', e.target.value)} className={formErrors.time ? styles.inputError : ''}>
                  <option value="">Selecciona una hora...</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{formatTimeLabel(t)}</option>)}
                </select>
                {formErrors.time && <span className={styles.errMsg}>{formErrors.time}</span>}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Mensaje al cliente <span className={styles.opt}>(opcional)</span></label>
              <textarea rows={2} placeholder="Información para el cliente..." value={form.message} onChange={(e) => set('message', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>Notas internas <span className={styles.opt}>(solo visible en el admin — no se envía en correos)</span></label>
              <textarea rows={2} placeholder="Notas privadas del equipo..." value={form.internal_notes} onChange={(e) => set('internal_notes', e.target.value)} />
            </div>
            <button type="submit" className={styles.saveBtn} disabled={formLoading}>
              {formLoading ? 'Agendando...' : '📅 Confirmar Reunión'}
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.filterButtons}>
          {(['all', 'confirmed', 'cancelled'] as const).map((s) => (
            <button key={s} className={filterStatus === s ? styles.active : ''} onClick={() => setFilterStatus(s)}>
              {s === 'all' ? 'Todas' : s === 'confirmed' ? 'Confirmadas' : 'Canceladas'}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className={styles.dateFilter}
          title="Filtrar por fecha"
        />
        {filterDate && (
          <button className={styles.clearDate} onClick={() => setFilterDate('')} title="Limpiar filtro de fecha">✕</button>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Agendado por</th>
              <th>Estado</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeetings.map((m) => (
              <tr key={m.id}>
                <td><strong>{m.name}</strong></td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td><span className={styles.typeBadge}>{m.meeting_type}</span></td>
                <td>{formatDate(m.date)}</td>
                <td>{formatTimeLabel(m.time.substring(0, 5))}</td>
                <td>
                  <span className={m.scheduled_by === 'admin' ? styles.byAdmin : styles.byClient}>
                    {m.scheduled_by === 'admin' ? '👤 Admin' : '🌐 Cliente'}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${m.status === 'confirmed' ? styles.confirmed : m.status === 'pending' ? styles.pending : styles.cancelled}`}>
                    {m.status === 'confirmed' ? '✅ Confirmada' : m.status === 'pending' ? '⏳ Pendiente' : '❌ Cancelada'}
                  </span>
                </td>
                <td className={styles.dateCell}>{formatDate(m.created_at.split('T')[0])}</td>
                <td>
                  <div className={styles.actions}>
                    {m.status === 'pending' && (
                      <button className={styles.actionBtn} onClick={() => handleManualConfirm(m.id)} title="Confirmar manualmente">
                        ✅ Confirmar
                      </button>
                    )}
                    {m.meet_link && (
                      <a href={m.meet_link} target="_blank" rel="noopener noreferrer" className={`${styles.actionBtn} ${styles.meetBtn}`} title="Abrir Google Meet">
                        🎥 Meet
                      </a>
                    )}
                    <a 
                      href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${m.name}, te escribimos de Turbo Brand respecto a tu reunión de ${m.meeting_type}.`)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`${styles.actionBtn} ${styles.waBtn}`}
                      title="Contactar por WhatsApp"
                    >
                      💬 WA
                    </a>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(m.id, m.name)} title="Borrar reunión">
                      🗑️ Borrar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMeetings.length === 0 && (
          <div className={styles.empty}>
            {searchTerm || filterStatus !== 'all' || filterDate
              ? 'No se encontraron reuniones con los filtros aplicados.'
              : 'No hay reuniones agendadas aún. ¡Agrega la primera!'}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <p>💡 <strong>Tip:</strong> Las reuniones se muestran de la más próxima a la más antigua. Usa el formulario de arriba para agendar desde el panel.</p>
      </div>
    </div>
  );
}

function ProtectedAdminMeetingsPage() {
  return (
    <ProtectedRoute>
      <AdminMeetingsPage />
    </ProtectedRoute>
  );
}

export default ProtectedAdminMeetingsPage;

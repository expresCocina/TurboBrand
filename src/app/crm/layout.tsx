"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    Mail,
    MessageSquare,
    Workflow,
    CheckSquare,
    BarChart3,
    Settings,
    Menu,
    X,
    LogOut,
    Loader2
} from 'lucide-react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/crm' },
    { icon: Users, label: 'Contactos', href: '/crm/contactos' },
    { icon: BarChart3, label: 'Pipeline', href: '/crm/ventas' },
    { icon: Mail, label: 'Email Marketing', href: '/crm/email' },
    { icon: MessageSquare, label: 'WhatsApp', href: '/crm/whatsapp' },
    { icon: Workflow, label: 'Automatización', href: '/crm/automatizacion' },
    { icon: CheckSquare, label: 'Tareas', href: '/crm/tareas' },
    { icon: Settings, label: 'Configuración', href: '/crm/configuracion' },
];

export default function CRMLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                    <p className="text-sm text-gray-500">Cargando CRM...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar para desktop */}
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow bg-gradient-to-b from-black via-gray-900 to-fuchsia-900 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center h-20 flex-shrink-0 px-6 bg-black/20">
                        <img
                            src="/LogoTurboBrand.webp"
                            alt="Turbo Brand CRM"
                            className="h-12 w-auto object-contain"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive
                                        ? 'bg-purple-700 text-white'
                                        : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User info */}
                    <div className="flex-shrink-0 border-t border-purple-700 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                                        TB
                                    </div>
                                </div>
                                <div className="ml-3 overflow-hidden">
                                    <p className="text-sm font-medium text-white truncate max-w-[140px]">
                                        {user?.email || 'Usuario'}
                                    </p>
                                    <p className="text-xs text-purple-300">Turbo Brand</p>
                                </div>
                            </div>
                            <Link
                                href="/"
                                className="text-purple-300 hover:text-white transition-colors"
                                title="Salir del CRM"
                            >
                                <LogOut className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Footer Credit */}
                    <div className="p-4 bg-black/20 text-center">
                        <p className="text-[10px] text-gray-400 font-medium">
                            Hecho con amor por <br />
                            <span className="text-purple-300/80 hover:text-purple-200 transition-colors cursor-default">
                                Renting AMC Agency Web
                            </span>
                        </p>
                    </div>
                </div>
            </aside>

            {/* Sidebar móvil */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />

                    <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-gradient-to-b from-black via-gray-900 to-fuchsia-900">
                        <div className="flex items-center justify-between h-16 px-4 bg-black/20">
                            <img
                                src="/LogoTurboBrand.webp"
                                alt="Turbo Brand CRM"
                                className="h-10 w-auto object-contain"
                            />
                            <button onClick={() => setSidebarOpen(false)} className="text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive
                                            ? 'bg-purple-700 text-white'
                                            : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex-shrink-0 border-t border-purple-700 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                                        TB
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">Turbo Brand</p>
                                        <p className="text-xs text-purple-300">Admin</p>
                                    </div>
                                </div>
                                <Link href="/" className="text-purple-300 hover:text-white">
                                    <LogOut className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Footer Credit Mobile */}
                        <div className="p-4 bg-black/20 text-center">
                            <p className="text-[10px] text-gray-400 font-medium">
                                Hecho con amor por <br />
                                <span className="text-purple-300/80">
                                    Renting AMC Agency Web
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="md:pl-64 flex flex-col flex-1">
                {/* Header móvil */}
                <div className="sticky top-0 z-10 md:hidden flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-600"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <img
                        src="/LogoTurboBrand.webp"
                        alt="Turbo Brand CRM"
                        className="h-8 w-auto object-contain"
                    />
                    <div className="w-6" />
                </div>

                {/* Contenido */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div >
    );
}

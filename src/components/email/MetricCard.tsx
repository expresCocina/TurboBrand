'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color?: 'purple' | 'green' | 'blue' | 'orange';
    trend?: string;
}

export default function MetricCard({ icon: Icon, label, value, color = 'purple', trend }: MetricCardProps) {
    const colorClasses = {
        purple: {
            bg: 'from-purple-500 to-purple-600',
            icon: 'bg-purple-100 text-purple-600',
            text: 'text-purple-600'
        },
        green: {
            bg: 'from-green-500 to-green-600',
            icon: 'bg-green-100 text-green-600',
            text: 'text-green-600'
        },
        blue: {
            bg: 'from-blue-500 to-blue-600',
            icon: 'bg-blue-100 text-blue-600',
            text: 'text-blue-600'
        },
        orange: {
            bg: 'from-orange-500 to-orange-600',
            icon: 'bg-orange-100 text-orange-600',
            text: 'text-orange-600'
        }
    };

    const colors = colorClasses[color];

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 p-5 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                    {trend && (
                        <p className={`text-xs font-medium ${colors.text}`}>{trend}</p>
                    )}
                </div>
                <div className={`p-3 ${colors.icon} rounded-xl`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

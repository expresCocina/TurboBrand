import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-900 to-black p-8 text-white">
                    <Link href="/crm" className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al CRM
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Shield className="h-8 w-8 text-purple-300" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Política de Privacidad</h1>
                            <p className="text-purple-200 mt-1">Turbo Brand CRM</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 sm:p-12 space-y-8 text-gray-600">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <Lock className="h-5 w-5 text-purple-600" />
                            1. Protección de Datos
                        </h2>
                        <p className="leading-relaxed">
                            En Turbo Brand, nos tomamos muy en serio la seguridad de tus datos. Toda la información almacenada en nuestro CRM
                            está protegida mediante encriptación de última generación y estrictos controles de acceso. Cumplimos con las normativas
                            vigentes de protección de datos para garantizar que tu información comercial y la de tus clientes esté siempre segura.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <Eye className="h-5 w-5 text-purple-600" />
                            2. Uso de la Información
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>La información recopilada se utiliza exclusivamente para la prestación de servicios de marketing y gestión de clientes.</li>
                            <li>No compartimos, vendemos ni alquilamos tus datos a terceros sin tu consentimiento explícito.</li>
                            <li>Utilizamos datos anónimos agregados para mejorar el rendimiento de nuestras herramientas de IA y automatización.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-purple-600" />
                            3. Tus Derechos
                        </h2>
                        <p className="leading-relaxed mb-4">
                            Como usuario de Turbo Brand CRM, tienes derecho a:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Acceder a tus datos personales en cualquier momento.</li>
                            <li>Solicitar la rectificación o eliminación de tus datos.</li>
                            <li>Exportar tu información en formatos estándar.</li>
                            <li>Revocar permisos de automatización o integraciones de terceros.</li>
                        </ul>
                    </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-100 p-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Turbo Brand. Todos los derechos reservados.</p>
                    <p className="mt-2">
                        Si tienes preguntas sobre nuestra política de privacidad, contáctanos en <a href="mailto:soporte@turbobrandcol.com" className="text-purple-600 hover:underline">soporte@turbobrandcol.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

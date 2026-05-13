import dynamic from 'next/dynamic';
import Hero from '@/components/Hero/Hero';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';

/*
 * Hero: Server Component — el h1 (LCP móvil) está en el HTML inicial.
 *
 * Below-the-fold: dynamic import con placeholders de altura fija
 * para evitar CLS cuando los componentes se montan en cliente.
 */
const Nosotros = dynamic(() => import('@/components/Nosotros/Nosotros'), {
    loading: () => <div style={{ minHeight: '500px' }} aria-hidden="true" />,
});
const Certifications = dynamic(() => import('@/components/Certifications/Certifications'), {
    loading: () => <div style={{ minHeight: '300px' }} aria-hidden="true" />,
});
const Servicios = dynamic(() => import('@/components/Servicios/Servicios'), {
    loading: () => <div style={{ minHeight: '500px' }} aria-hidden="true" />,
});
const Clientes = dynamic(() => import('@/components/Clientes/Clientes'), {
    loading: () => <div style={{ minHeight: '400px' }} aria-hidden="true" />,
});
const TuLocalDigital = dynamic(() => import('@/components/TuLocalDigital/TuLocalDigital'), {
    loading: () => <div style={{ minHeight: '600px' }} aria-hidden="true" />,
});
const ContactoForm = dynamic(() => import('@/components/ContactoForm/ContactoForm'), {
    loading: () => <div style={{ minHeight: '500px' }} aria-hidden="true" />,
});

export default function Home() {
    return (
        <main>
            {/* Hero: Server Component — h1 en HTML inicial → LCP rápido en móvil */}
            <Hero />

            <SectionWrapper id="nosotros">
                <Nosotros />
            </SectionWrapper>

            <Certifications />

            <SectionWrapper id="servicios">
                <Servicios />
            </SectionWrapper>

            <Clientes />

            <TuLocalDigital />

            <SectionWrapper id="contacto">
                <ContactoForm />
            </SectionWrapper>
        </main>
    );
}

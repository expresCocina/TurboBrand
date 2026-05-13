import dynamic from 'next/dynamic';
import Hero from '@/components/Hero/Hero';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';

/*
 * Lazy load de secciones below-the-fold.
 * NOTE: No se puede usar ssr:false en Server Components (page.tsx).
 * El ssr:false solo aplica para el mapa Leaflet dentro de TuLocalDigital.tsx.
 * Los placeholders con minHeight fijos previenen CLS.
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
            {/* Hero se renderiza en SSR — es el LCP element */}
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

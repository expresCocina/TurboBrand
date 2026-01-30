import dynamic from 'next/dynamic';
import Hero from '@/components/Hero/Hero';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';

// Lazy load below-the-fold components
const Nosotros = dynamic(() => import('@/components/Nosotros/Nosotros'), {
    loading: () => <div style={{ minHeight: '400px' }} />,
});
const Certifications = dynamic(() => import('@/components/Certifications/Certifications'), {
    loading: () => <div style={{ minHeight: '300px' }} />,
});
const Servicios = dynamic(() => import('@/components/Servicios/Servicios'), {
    loading: () => <div style={{ minHeight: '500px' }} />,
});
const Clientes = dynamic(() => import('@/components/Clientes/Clientes'), {
    loading: () => <div style={{ minHeight: '400px' }} />,
});
const TuLocalDigital = dynamic(() => import('@/components/TuLocalDigital/TuLocalDigital'), {
    loading: () => <div style={{ minHeight: '600px' }} />,
});
const ContactoForm = dynamic(() => import('@/components/ContactoForm/ContactoForm'), {
    loading: () => <div style={{ minHeight: '500px' }} />,
});

export default function Home() {
    return (
        <main>
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

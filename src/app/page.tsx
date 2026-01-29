import Hero from '@/components/Hero/Hero';
import Nosotros from '@/components/Nosotros/Nosotros';
import Certifications from '@/components/Certifications/Certifications';
import Servicios from '@/components/Servicios/Servicios';
import Clientes from '@/components/Clientes/Clientes';
import TuLocalDigital from '@/components/TuLocalDigital/TuLocalDigital';
import ContactoForm from '@/components/ContactoForm/ContactoForm';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';

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

            <SectionWrapper id="clientes">
                <Clientes />
            </SectionWrapper>

            <SectionWrapper id="tu-local-digital">
                <TuLocalDigital />
            </SectionWrapper>

            <SectionWrapper id="contacto">
                <ContactoForm />
            </SectionWrapper>
        </main>
    );
}

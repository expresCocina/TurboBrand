"use client";
import styles from './Servicios.module.css';
import { Megaphone, TrendingUp, Monitor, Video, GraduationCap } from 'lucide-react';

const services = [
    {
        icon: <Megaphone size={40} />,
        title: 'Pauta Digital',
        desc: 'Gestionamos tus campañas de Meta Ads, Google Ads, TikTok y otros canales para que tu presupuesto llegue a las personas que más te pueden comprar, en el momento justo. Nos enfocamos en optimizar cada centavo: segmentaciones, creativos y ajustes constantes para mejorar el ROI y que cada peso traiga resultados reales, no solo clics.'
    },
    {
        icon: <TrendingUp size={40} />,
        title: 'Consultoría y Acompañamiento Estratégico',
        desc: 'No solo hacemos campañas, te ayudamos a entender qué está pasando en tu negocio digital. Te acompañamos a sacar aprendizajes de los datos, tomar decisiones claras y alinear tu estrategia de pauta, automatización y contenidos a lo que realmente importa: vender más y crecer con cabeza.'
    },
    {
        icon: <Monitor size={40} />,
        title: 'Desarrollo Web',
        desc: 'Creamos páginas web y landings que NO se ven bonitas solas, sino que convierten. Desde el diseño hasta el código, trabajamos pensando en tus objetivos: que cada visitante encuentre lo que necesita y deje datos, compre o agende una cita, sin complicaciones.'
    },
    {
        icon: <Video size={40} />,
        title: 'Contenidos Digitales',
        desc: 'Diseñamos contenido que funcione, Estrategia de contenidos, calendarios y piezas que ayudan a posicionar tu marca, darle valor a tu audiencia y generar confianza antes de que llegue a tu pauta, para que todo cierre mejor, modelos UGC y mucho más.'
    },
    {
        icon: <GraduationCap size={40} />,
        title: 'Clases personalizadas en Meta, Google y TikTok Ads',
        desc: 'Clases 100 % personalizadas, 100 % para ti. Si eres emprendedor, marca personal o dueño de negocio, te enseñamos paso a paso cómo funciona la pauta digital, desde cero hasta que puedas armar y monitorear tus campañas con claridad, sin misterios ni tecnicismos.'
    }
];

export default function Servicios() {
    return (
        <div className={`container ${styles.section}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>Nuestros Servicios</h2>
                <p className={styles.intro}>
                    En Turbo Brand no vendemos magia ni métricas bonitas: ayudamos a marcas como la tuya a escalar con pauta digital,
                    automatización y activos que generan flujo de compra real. Nos enfocamos en bajar tus costos de adquisición,
                    mejorar el ROI de cada campaña y construir procesos que conviertan visitantes en clientes.
                </p>
            </div>

            <div className={styles.grid}>
                {services.map((s, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.icon}>{s.icon}</div>
                        <h3 className={styles.sTitle}>{s.title}</h3>
                        <p className={styles.desc}>{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

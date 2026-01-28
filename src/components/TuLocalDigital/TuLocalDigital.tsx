import styles from './TuLocalDigital.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function TuLocalDigital() {
    return (
        <div className={`container ${styles.section}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Transforma tu negocio en la tienda que todos encuentran en Google, Facebook, Instagram, Tik tok y todas las redes sociales.
                </h2>
                <p className={styles.intro}>
                    Un servicio exclusivo para locales comerciales y tiendas online: nosotros posicionamos tu negocio en Google con SEO y pauta paga,
                    y te regalamos un video UGC para Meta Ads… Completamente Gratis por adquirir contrato fijo con Turbo brand.
                </p>
            </div>

            <div className={styles.howItWorks}>
                <h3 className={styles.sectionTitle}>¿Cómo funciona? (3 pasos simples)</h3>
                <div className={styles.stepsGrid}>
                    <div className={styles.stepCard}>
                        <span className={styles.stepNum}>1</span>
                        <h4>Nosotros posicionamos tu local en Google</h4>
                        <p>Invertimos en SEO y pauta para que cuando alguien busque en Google tu tipo de negocio en tu zona, tu local sea de los primeros en aparecer.</p>
                        <p className={styles.muted}>No es promesa, es estrategia clara: optimización técnica web, contenidos locales, Google Business y pauta en Google Maps y Google Search.</p>
                    </div>
                    <div className={styles.stepCard}>
                        <span className={styles.stepNum}>2</span>
                        <h4>Tú ganas visibilidad en Google + Meta</h4>
                        <p>Tu local sale en Google cuando buscan tu servicio (Google Search, Google Maps).</p>
                        <p className={styles.muted}>Y en Meta (Facebook e Instagram) con anuncios de pauta paga, con un mensaje claro y dirigido a tu zona.</p>
                    </div>
                    <div className={styles.stepCard}>
                        <span className={styles.stepNum}>3</span>
                        <h4>Te regalamos un video UGC para pauta en Meta Ads</h4>
                        <p>Hacemos 1 video profesional estilo UGC (contenido real de cliente) que muestra tu producto/servicio.</p>
                        <p className={styles.muted}>Lo usamos en Meta Ads como anuncio para que tu audiencia local te vea, confíe y visite tu local.</p>
                    </div>
                </div>
            </div>

            <div className={styles.detailsGrid}>
                <div className={styles.detailCol}>
                    <h3>Lo que ganas</h3>
                    <ul>
                        <li>Tu negocio aparece en Google cuando alguien busca tu rubro en tu zona.</li>
                        <li>Tus clientes te ven en Meta y dejan de ir a la competencia.</li>
                        <li>Aumentas ventas sin que tu equipo tenga que hacer marketing complejo.</li>
                        <li>Reduces costos de adquisición: la gente que llega ya busca algo específico y está cerca.</li>
                        <li>Todo esto por un contrato claro de 6 meses (no es “gratis para siempre”, es una inversión en crecimiento).</li>
                    </ul>
                </div>
                <div className={styles.detailCol}>
                    <h3>¿Quién puede aplicar?</h3>
                    <p className={styles.highlightText}>Esta oportunidad es exclusiva para:</p>
                    <ul>
                        <li>Locales comerciales físicos</li>
                        <li>Un solo negocio por rubro (ej. solo 1 pizzería, 1 peluquería, 1 ferretería por zona).</li>
                        <li>Negocios que quieran crecer en los próximos 6 meses con pauta digital y presencia en Google.</li>
                    </ul>
                </div>
            </div>

            <div className={styles.offerGrid}>
                <div className={styles.offerCard}>
                    <h3>¿Qué ofrecemos?</h3>
                    <ul>
                        <li>Estrategia completa de SEO local.</li>
                        <li>Gestión de pauta en Google Ads y Meta Ads.</li>
                        <li>1 video profesional tipo UGC listo para anuncios.</li>
                        <li>Informes mensuales claros de resultados (visitas, llamadas, mensajes, visitas a local).</li>
                    </ul>
                </div>
                <div className={styles.offerCard}>
                    <h3>¿Qué pagas?</h3>
                    <ul>
                        <li>Pago fijo mensual por pauta y gestión de las campañas.</li>
                        <li>Nuestro costo de SEO y creación del video UGC lo asumimos nosotros durante estos 6 meses.</li>
                        <li><strong>Duración del servicio: Mínimo 6 meses.</strong></li>
                    </ul>
                </div>
            </div>

            <div className={styles.whyOne}>
                <h3>¿Por qué “sólo 1 negocio por zona”?</h3>
                <p>Queremos impactar, no saturar el mercado. Si posicionamos a 10 mueblerías iguales en un mismo barrio, no hay ganadores claros.</p>
                <p><strong>Escogemos 1 negocio por rubro y zona para que tú seas el local más visible en Google y Meta.</strong></p>
            </div>

            <div className={styles.mapContainer}>
                <h3>MAPA MEDELLIN Y ÁREA METROPOLITANA</h3>
                <div className={styles.mapWrapper}>
                    <Image
                        src="/maps/medellin-area.svg"
                        alt="Mapa Cobertura Medellín y Área Metropolitana"
                        width={800}
                        height={500}
                        className={styles.mapImg}
                    />
                </div>
            </div>

            <div className={styles.ctaWrapper}>
                <Link href="#contacto" className={styles.cta}>
                    ¿Quieres que tu local aparezca en Google y en Meta? Agenda una llamada
                </Link>
            </div>
        </div>
    );
}

"use client";

import { Rocket, Target, Code, Megaphone, GraduationCap, Cpu } from 'lucide-react';
import styles from './Servicios.module.css';

const servicios = [
  {
    title: "Pauta Digital",
    desc: "Gestionamos tus campañas de Meta Ads, Google Ads y TikTok para que tu presupuesto llegue a las personas que realmente compran",
    icon: <Target className={styles.iconMain} />,
    tag: "ROI & VENTAS"
  },
  {
    title: "Consultoría Estratégica",
    desc: "Te ayudamos a entender qué pasa en tu negocio digital para tomar decisiones claras y crecer con cabeza",
    icon: <Rocket className={styles.iconMain} />,
    tag: "ESTRATEGIA"
  },
  {
    title: "Ingeniería Web",
    desc: "Creamos páginas y landings que NO solo se ven bonitas, sino que están hechas para convertir visitantes en clientes",
    icon: <Code className={styles.iconMain} />,
    tag: "CONVERSIÓN"
  },
  {
    title: "Contenidos Digitales",
    desc: "Diseñamos estrategias de contenido, modelos UGC y piezas que generan confianza antes de que llegue la pauta",
    icon: <Megaphone className={styles.iconMain} />,
    tag: "REPUTACIÓN"
  },
  {
    title: "Clases Personalizadas",
    desc: "Aprende paso a paso cómo funciona la pauta digital para monitorear tus campañas con claridad y sin misterios",
    icon: <GraduationCap className={styles.iconMain} />,
    tag: "APRENDIZAJE"
  },
  {
    title: "Automatización",
    desc: "Desarrollamos procesos que automatizan tareas clave para que tu negocio escale sin que tú pases más horas frente al PC",
    icon: <Cpu className={styles.iconMain} />,
    tag: "EFICIENCIA"
  }
];

export default function Servicios() {
  return (
    <section className={styles.serviciosSection} id="servicios">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nuestros productos y servicios</h2>
          <p className={styles.subtitle}>
            Ayudamos a marcas como la tuya a escalar con pauta digital, automatización y activos que generan flujo de compra real.
          </p>
        </div>

        <div className={styles.grid}>
          {servicios.map((servicio, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconContainer}>
                  {servicio.icon}
                </div>
                <span className={styles.cardTag}>{servicio.tag}</span>
              </div>
              <div className={styles.content}>
                <h3>{servicio.title}</h3>
                <p>{servicio.desc}</p>
                <a
                  href={`https://wa.me/573001234567?text=Hola, me interesa obtener más información sobre ${servicio.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnVerMas}
                >
                  Más info <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
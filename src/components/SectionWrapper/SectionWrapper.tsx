"use client";
import { useEffect, useRef } from "react";
import { ReactNode } from "react";
import styles from "./SectionWrapper.module.css";

interface Props {
    id: string;
    children: ReactNode;
    className?: string;
}

export default function SectionWrapper({ id, children, className = "" }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add(styles.visible);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section id={id} className={`${styles.section} ${className}`}>
            <div ref={ref} className={styles.fadeIn}>
                {children}
            </div>
        </section>
    );
}

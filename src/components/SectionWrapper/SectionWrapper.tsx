"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import styles from "./SectionWrapper.module.css";

interface Props {
    id: string;
    children: ReactNode;
    className?: string; // Allow passing extra classes if needed
}

export default function SectionWrapper({ id, children, className = "" }: Props) {
    return (
        <section id={id} className={`${styles.section} ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </section>
    );
}

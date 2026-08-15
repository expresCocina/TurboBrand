"use client";

import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
    const phoneNumber = '573007543238';
    const message = encodeURIComponent('¡Hola! Me gustaría conocer más sobre los servicios de Turbo Brand para impulsar mi negocio 🚀');

    return (
        <Link
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            className={styles.floatBtn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat en WhatsApp"
        >
            <FaWhatsapp />
        </Link>
    );
}

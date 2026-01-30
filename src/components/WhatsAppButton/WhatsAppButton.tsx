"use client";

import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
    const phoneNumber = '573138537261'; // Updated as per previous context if available, otherwise using the one from Footer.
    const message = encodeURIComponent('Hola Turbo Brand, quiero impulsar mi marca 🚀');

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

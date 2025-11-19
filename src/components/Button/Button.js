import Link from 'next/link';
import styles from './Button.module.css';

export default function Button({
    children,
    href,
    variant = 'primary',
    className = '',
    ...props
}) {
    const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={buttonClass} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    );
}

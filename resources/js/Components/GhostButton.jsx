import { Link } from '@inertiajs/react';

export default function GhostButton({ href, className = '', children, ...props }) {
    if (href) {
        return (
            <Link href={href} className={`btn-ghost ${className}`} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={`btn-ghost ${className}`} {...props}>
            {children}
        </button>
    );
}

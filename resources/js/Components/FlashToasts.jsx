import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashToasts() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const id = setTimeout(() => setVisible(false), 4500);
        return () => clearTimeout(id);
    }, [flash?.success, flash?.error]);

    if (!visible || (!flash?.success && !flash?.error)) return null;

    const isError = Boolean(flash?.error);

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
            <div
                className={`card border-l-4 px-4 py-3 text-sm shadow-lg ${
                    isError ? 'border-l-capsule-rust' : 'border-l-capsule-teal'
                }`}
            >
                {isError ? flash.error : flash.success}
            </div>
        </div>
    );
}

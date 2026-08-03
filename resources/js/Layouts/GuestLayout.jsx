import { Link } from '@inertiajs/react';
import WaxSeal from '@/Components/WaxSeal';

export default function GuestLayout({ children, heading, sub }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-capsule-void bg-grain px-6 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-8 flex flex-col items-center text-center">
                    <Link href={route('home')}>
                        <WaxSeal size={44} locked />
                    </Link>
                    <h1 className="mt-4 font-display text-2xl font-medium">{heading}</h1>
                    {sub && <p className="mt-1 text-sm text-capsule-parchmentDim">{sub}</p>}
                </div>
                <div className="card p-6">{children}</div>
            </div>
        </div>
    );
}

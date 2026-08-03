import { Link, usePage, router } from '@inertiajs/react';
import { LayoutGrid, Plus, LogOut, Archive } from 'lucide-react';
import WaxSeal from '@/Components/WaxSeal';
import FlashToasts from '@/Components/FlashToasts';

export default function AppLayout({ children, header }) {
    const { auth } = usePage().props;

    const nav = [
        { label: 'Dashboard', href: route('dashboard'), icon: LayoutGrid, active: route().current('dashboard') },
        { label: 'My capsules', href: route('capsules.index'), icon: Archive, active: route().current('capsules.*') },
    ];

    return (
        <div className="min-h-screen bg-capsule-void bg-grain">
            <header className="border-b border-capsule-line">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href={route('dashboard')} className="flex items-center gap-3">
                        <WaxSeal size={32} locked />
                        <span className="font-display text-lg font-medium tracking-tight">Time Capsule</span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {nav.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                                    item.active
                                        ? 'bg-capsule-panel2 text-capsule-brass'
                                        : 'text-capsule-parchmentDim hover:text-capsule-parchment'
                                }`}
                            >
                                <item.icon size={16} strokeWidth={2} />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link href={route('capsules.create')} className="btn-primary">
                            <Plus size={16} strokeWidth={2.5} />
                            <span className="hidden sm:inline">New capsule</span>
                        </Link>
                        <div className="hidden items-center gap-2 pl-2 sm:flex">
                            <span className="text-sm text-capsule-parchmentDim">{auth.user?.name}</span>
                            <button
                                onClick={() => router.post(route('logout'))}
                                className="rounded-md p-2 text-capsule-parchmentFaint transition hover:text-capsule-rust"
                                title="Sign out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {header && (
                <div className="border-b border-capsule-line bg-capsule-panel/40">
                    <div className="mx-auto max-w-6xl px-6 py-6">{header}</div>
                </div>
            )}

            <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>

            <FlashToasts />
        </div>
    );
}

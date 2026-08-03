import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CapsuleCard from '@/Components/CapsuleCard';
import Countdown from '@/Components/Countdown';
import WaxSeal from '@/Components/WaxSeal';
import { Lock, Unlock, Archive, Plus } from 'lucide-react';

export default function Dashboard({ stats, recent }) {
    return (
        <AppLayout header={<h1 className="font-display text-2xl font-medium">Dashboard</h1>}>
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon={Archive} label="Total capsules" value={stats.total} />
                <StatCard icon={Lock} label="Locked" value={stats.locked} accent="text-capsule-brass" />
                <StatCard icon={Unlock} label="Unlocked" value={stats.unlocked} accent="text-capsule-teal" />
            </div>

            {stats.upcoming.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-3 font-display text-lg font-medium">Next to unlock</h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.upcoming.map((c) => (
                            <Link
                                key={c.id}
                                href={route('capsules.show', c.id)}
                                className="card flex items-center gap-4 p-4 transition hover:border-capsule-brass/50"
                            >
                                <WaxSeal size={36} locked initial={c.title?.[0]} />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{c.title}</p>
                                    <Countdown unlockAt={c.unlock_at} compact />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-display text-lg font-medium">Recent capsules</h2>
                    <Link href={route('capsules.index')} className="text-sm text-capsule-brass hover:underline">
                        View all
                    </Link>
                </div>

                {recent.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {recent.map((c) => (
                            <CapsuleCard key={c.id} capsule={c} />
                        ))}
                    </div>
                )}
            </section>
        </AppLayout>
    );
}

function StatCard({ icon: Icon, label, value, accent = 'text-capsule-parchment' }) {
    return (
        <div className="card flex items-center gap-4 p-5">
            <div className="rounded-full bg-capsule-panel2 p-3">
                <Icon size={20} className={accent} />
            </div>
            <div>
                <p className={`font-display text-2xl font-medium ${accent}`}>{value}</p>
                <p className="text-sm text-capsule-parchmentFaint">{label}</p>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="card flex flex-col items-center gap-4 p-12 text-center">
            <WaxSeal size={48} locked />
            <div>
                <p className="font-display text-lg font-medium">Nothing sealed yet</p>
                <p className="mt-1 text-sm text-capsule-parchmentDim">
                    Create your first capsule and choose when it opens.
                </p>
            </div>
            <Link href={route('capsules.create')} className="btn-primary">
                <Plus size={16} /> Create a capsule
            </Link>
        </div>
    );
}

import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CapsuleCard from '@/Components/CapsuleCard';
import WaxSeal from '@/Components/WaxSeal';
import { Plus } from 'lucide-react';

const tabs = [
    { key: 'all', label: 'All' },
    { key: 'locked', label: 'Locked' },
    { key: 'unlocked', label: 'Unlocked' },
    { key: 'shared', label: 'Shared with me' },
];

export default function Index({ capsules, filter }) {
    const setFilter = (key) => {
        router.get(route('capsules.index'), { filter: key }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <h1 className="font-display text-2xl font-medium">My Capsules</h1>
                    <Link href={route('capsules.create')} className="btn-primary">
                        <Plus size={16} /> New capsule
                    </Link>
                </div>
            }
        >
            <Head title="My Capsules" />

            <div className="mb-6 flex gap-1 border-b border-capsule-line">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                            filter === tab.key
                                ? 'border-capsule-brass text-capsule-brass'
                                : 'border-transparent text-capsule-parchmentDim hover:text-capsule-parchment'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {capsules.length === 0 ? (
                <div className="card flex flex-col items-center gap-4 p-12 text-center">
                    <WaxSeal size={48} locked />
                    <p className="text-sm text-capsule-parchmentDim">No capsules match this filter yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {capsules.map((c) => (
                        <CapsuleCard key={c.id} capsule={c} />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}

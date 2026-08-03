import { Link } from '@inertiajs/react';
import WaxSeal from './WaxSeal';
import Countdown from './Countdown';

const typeLabels = {
    personal: 'Personal',
    event: 'Event',
    shared: 'Shared',
};

export default function CapsuleCard({ capsule }) {
    return (
        <Link
            href={route('capsules.show', capsule.id)}
            className="card group flex flex-col gap-4 p-5 transition hover:border-capsule-brass/50 hover:bg-capsule-panel2"
        >
            <div className="flex items-start justify-between">
                <WaxSeal locked={capsule.is_locked} initial={capsule.title?.[0]} />
                <span className="rounded-full border border-capsule-line px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-capsule-parchmentFaint">
                    {typeLabels[capsule.type] ?? capsule.type}
                    {!capsule.is_owner && ' · shared'}
                </span>
            </div>

            <div>
                <h3 className="font-display text-lg font-medium leading-snug text-capsule-parchment group-hover:text-capsule-brass">
                    {capsule.title}
                </h3>
                {capsule.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-capsule-parchmentDim">{capsule.description}</p>
                )}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-capsule-line pt-3 text-sm">
                {capsule.is_locked ? (
                    <Countdown unlockAt={capsule.unlock_at} compact />
                ) : (
                    <span className="text-capsule-teal">open now</span>
                )}
                <span className="text-capsule-parchmentFaint">
                    {capsule.files_count ?? 0} item{capsule.files_count === 1 ? '' : 's'}
                </span>
            </div>
        </Link>
    );
}

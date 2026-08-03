import { useEffect, useState } from 'react';

function partsUntil(target) {
    const diff = Math.max(0, new Date(target).getTime() - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds, done: diff <= 0 };
}

export default function Countdown({ unlockAt, compact = false }) {
    const [parts, setParts] = useState(() => partsUntil(unlockAt));

    useEffect(() => {
        const id = setInterval(() => setParts(partsUntil(unlockAt)), 1000);
        return () => clearInterval(id);
    }, [unlockAt]);

    if (parts.done) {
        return <span className="font-mono text-sm text-capsule-teal">unlocking now</span>;
    }

    if (compact) {
        return (
            <span className="font-mono text-sm text-capsule-parchmentDim">
                {parts.days}d {String(parts.hours).padStart(2, '0')}h
            </span>
        );
    }

    const cells = [
        ['days', parts.days],
        ['hrs', parts.hours],
        ['min', parts.minutes],
        ['sec', parts.seconds],
    ];

    return (
        <div className="flex gap-3 font-mono">
            {cells.map(([label, value]) => (
                <div key={label} className="text-center">
                    <div className="rounded-md border border-capsule-line bg-capsule-panel2 px-3 py-2 text-xl font-semibold text-capsule-brass">
                        {String(value).padStart(2, '0')}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-capsule-parchmentFaint">{label}</div>
                </div>
            ))}
        </div>
    );
}

import { Head, Link } from '@inertiajs/react';
import WaxSeal from '@/Components/WaxSeal';

export default function Welcome() {
    return (
        <>
            <Head title="Digital Time Capsule" />
            <div className="min-h-screen bg-capsule-void bg-grain">
                <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-3">
                        <WaxSeal size={36} locked />
                        <span className="font-display text-lg font-medium">Time Capsule</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('login')} className="btn-ghost">Sign in</Link>
                        <Link href={route('register')} className="btn-primary">Create account</Link>
                    </div>
                </header>

                <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
                    <div>
                        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-capsule-brass">
                            sealed today, opened later
                        </p>
                        <h1 className="font-display text-4xl font-medium leading-[1.1] text-capsule-parchment md:text-5xl">
                            Some things are worth reading again, only later.
                        </h1>
                        <p className="mt-6 max-w-md text-capsule-parchmentDim">
                            Pack photos, videos, voice notes, and letters into a capsule, set a
                            date years from now, and let it seal itself shut until then. No
                            folder to forget about — it opens on its own, and tells you when it does.
                        </p>
                        <div className="mt-8 flex gap-3">
                            <Link href={route('register')} className="btn-primary px-6 py-3">
                                Start your first capsule
                            </Link>
                            <Link href={route('login')} className="btn-ghost px-6 py-3">
                                I already have one
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 self-center">
                        {[
                            { title: 'Personal', desc: 'A letter to your future self.', color: 'from-capsule-brass to-capsule-brassDim' },
                            { title: 'Event', desc: 'Graduations, weddings, Ramadan reflections.', color: 'from-capsule-teal to-capsule-tealDim' },
                            { title: 'Shared', desc: 'A class, a family, a team — one capsule, many voices.', color: 'from-capsule-rust to-capsule-brassDim' },
                            { title: 'Automatic', desc: 'Unlocks and notifies everyone — no reminders needed.', color: 'from-capsule-brassDim to-capsule-void' },
                        ].map((c) => (
                            <div key={c.title} className="card p-5">
                                <div className={`mb-4 h-10 w-10 rounded-full bg-gradient-to-br ${c.color}`} />
                                <h3 className="font-display text-base font-medium">{c.title}</h3>
                                <p className="mt-1 text-sm text-capsule-parchmentDim">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

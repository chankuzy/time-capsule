import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import GhostButton from '@/Components/GhostButton';
import { X, Plus } from 'lucide-react';

const types = [
    { key: 'personal', label: 'Personal', desc: 'For your future self' },
    { key: 'event', label: 'Event', desc: 'A birthday, graduation, wedding…' },
    { key: 'shared', label: 'Shared', desc: 'Many people contribute together' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: 'personal',
        event_label: '',
        unlock_at: '',
        allow_contributions: false,
        recipients: [],
    });

    const [recipientInput, setRecipientInput] = useState('');

    const addRecipient = () => {
        const email = recipientInput.trim();
        if (email && !data.recipients.includes(email)) {
            setData('recipients', [...data.recipients, email]);
        }
        setRecipientInput('');
    };

    const removeRecipient = (email) => {
        setData('recipients', data.recipients.filter((r) => r !== email));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('capsules.store'));
    };

    // Minimum: tomorrow. Capsules can't be scheduled to open "now" — the whole point is future delivery.
    const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 16);

    return (
        <AppLayout header={<h1 className="font-display text-2xl font-medium">Create a Capsule</h1>}>
            <Head title="Create Capsule" />

            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-8">
                <section className="card space-y-5 p-6">
                    <div>
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            id="title"
                            value={data.title}
                            autoFocus
                            placeholder="My Future Goals"
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Description (optional)" />
                        <textarea
                            id="description"
                            rows={3}
                            className="field-input"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <InputLabel value="Capsule type" />
                        <div className="grid grid-cols-3 gap-3">
                            {types.map((t) => (
                                <button
                                    type="button"
                                    key={t.key}
                                    onClick={() => setData('type', t.key)}
                                    className={`rounded-md border p-3 text-left transition ${
                                        data.type === t.key
                                            ? 'border-capsule-brass bg-capsule-panel2'
                                            : 'border-capsule-line hover:border-capsule-brass/50'
                                    }`}
                                >
                                    <p className="text-sm font-medium">{t.label}</p>
                                    <p className="mt-0.5 text-xs text-capsule-parchmentFaint">{t.desc}</p>
                                </button>
                            ))}
                        </div>
                        <InputError message={errors.type} />
                    </div>

                    {data.type === 'event' && (
                        <div>
                            <InputLabel htmlFor="event_label" value="Event name" />
                            <TextInput
                                id="event_label"
                                value={data.event_label}
                                placeholder="Graduation, Wedding, Ramadan Reflections…"
                                onChange={(e) => setData('event_label', e.target.value)}
                            />
                            <InputError message={errors.event_label} />
                        </div>
                    )}

                    {data.type === 'shared' && (
                        <label className="flex items-center gap-2 text-sm text-capsule-parchmentDim">
                            <input
                                type="checkbox"
                                checked={data.allow_contributions}
                                onChange={(e) => setData('allow_contributions', e.target.checked)}
                                className="rounded border-capsule-line bg-capsule-panel2 text-capsule-brass focus:ring-capsule-brass"
                            />
                            Let added recipients upload their own content, not just view it
                        </label>
                    )}

                    <div>
                        <InputLabel htmlFor="unlock_at" value="Opening date" />
                        <TextInput
                            id="unlock_at"
                            type="datetime-local"
                            min={minDate}
                            value={data.unlock_at}
                            onChange={(e) => setData('unlock_at', e.target.value)}
                        />
                        <InputError message={errors.unlock_at} />
                    </div>
                </section>

                <section className="card space-y-4 p-6">
                    <div>
                        <InputLabel value="Recipients (optional)" />
                        <p className="mb-3 text-xs text-capsule-parchmentFaint">
                            We match by email — they'll get access whether they already have an
                            account or sign up later.
                        </p>
                        <div className="flex gap-2">
                            <TextInput
                                type="email"
                                placeholder="someone@example.com"
                                value={recipientInput}
                                onChange={(e) => setRecipientInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addRecipient();
                                    }
                                }}
                            />
                            <GhostButton type="button" onClick={addRecipient}>
                                <Plus size={16} />
                            </GhostButton>
                        </div>
                        <InputError message={errors.recipients} />
                    </div>

                    {data.recipients.length > 0 && (
                        <ul className="space-y-2">
                            {data.recipients.map((email) => (
                                <li
                                    key={email}
                                    className="flex items-center justify-between rounded-md border border-capsule-line bg-capsule-panel2 px-3 py-2 text-sm"
                                >
                                    {email}
                                    <button
                                        type="button"
                                        onClick={() => removeRecipient(email)}
                                        className="text-capsule-parchmentFaint hover:text-capsule-rust"
                                    >
                                        <X size={14} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <div className="flex justify-end gap-3">
                    <GhostButton href={route('capsules.index')}>Cancel</GhostButton>
                    <PrimaryButton disabled={processing}>Seal capsule</PrimaryButton>
                </div>
            </form>
        </AppLayout>
    );
}

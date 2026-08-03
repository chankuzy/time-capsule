import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import GhostButton from '@/Components/GhostButton';
import { router } from '@inertiajs/react';

export default function Edit({ capsule }) {
    const { data, setData, put, processing, errors } = useForm({
        title: capsule.title,
        description: capsule.description ?? '',
        type: capsule.type,
        event_label: capsule.event_label ?? '',
        cover_color: capsule.cover_color,
        unlock_at: capsule.unlock_at?.slice(0, 16),
        allow_contributions: capsule.allow_contributions,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('capsules.update', capsule.id));
    };

    const destroy = () => {
        if (confirm('Delete this capsule permanently? This cannot be undone.')) {
            router.delete(route('capsules.destroy', capsule.id));
        }
    };

    return (
        <AppLayout header={<h1 className="font-display text-2xl font-medium">Edit Capsule</h1>}>
            <Head title={`Edit · ${capsule.title}`} />

            <form onSubmit={submit} className="mx-auto max-w-2xl space-y-6">
                <section className="card space-y-5 p-6">
                    <div>
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        <InputError message={errors.title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            rows={3}
                            className="field-input"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>

                    {data.type === 'event' && (
                        <div>
                            <InputLabel htmlFor="event_label" value="Event name" />
                            <TextInput
                                id="event_label"
                                value={data.event_label}
                                onChange={(e) => setData('event_label', e.target.value)}
                            />
                            <InputError message={errors.event_label} />
                        </div>
                    )}

                    <div>
                        <InputLabel htmlFor="unlock_at" value="Opening date" />
                        <TextInput
                            id="unlock_at"
                            type="datetime-local"
                            value={data.unlock_at}
                            onChange={(e) => setData('unlock_at', e.target.value)}
                        />
                        <InputError message={errors.unlock_at} />
                        <p className="mt-1.5 text-xs text-capsule-parchmentFaint">
                            Only capsules still locked can be rescheduled.
                        </p>
                    </div>
                </section>

                <div className="flex items-center justify-between">
                    <button type="button" onClick={destroy} className="text-sm text-capsule-rust hover:underline">
                        Delete capsule
                    </button>
                    <div className="flex gap-3">
                        <GhostButton href={route('capsules.show', capsule.id)}>Cancel</GhostButton>
                        <PrimaryButton disabled={processing}>Save changes</PrimaryButton>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}

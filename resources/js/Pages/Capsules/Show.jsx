import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import WaxSeal from '@/Components/WaxSeal';
import Countdown from '@/Components/Countdown';
import PrimaryButton from '@/Components/PrimaryButton';
import GhostButton from '@/Components/GhostButton';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Image, Video, Music, FileText, MessageSquare, Trash2, Settings, UserPlus, Download } from 'lucide-react';

const typeIcons = { photo: Image, video: Video, audio: Music, document: FileText, message: MessageSquare };

export default function Show({ capsule }) {
    return (
        <AppLayout>
            <Head title={capsule.title} />

            <div className="mx-auto max-w-3xl">
                <CapsuleHeader capsule={capsule} />

                {capsule.is_locked ? (
                    <LockedBody capsule={capsule} />
                ) : (
                    <UnlockedBody capsule={capsule} />
                )}
            </div>
        </AppLayout>
    );
}

function CapsuleHeader({ capsule }) {
    return (
        <div className="card mb-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <WaxSeal size={52} locked={capsule.is_locked} initial={capsule.title[0]} />
                <div>
                    <p className="text-xs uppercase tracking-wider text-capsule-parchmentFaint">
                        {capsule.type}{capsule.event_label ? ` · ${capsule.event_label}` : ''}
                    </p>
                    <h1 className="font-display text-2xl font-medium">{capsule.title}</h1>
                    {capsule.description && (
                        <p className="mt-1 max-w-md text-sm text-capsule-parchmentDim">{capsule.description}</p>
                    )}
                </div>
            </div>

            {capsule.is_owner && capsule.is_locked && (
                <Link href={route('capsules.edit', capsule.id)} className="btn-ghost self-start">
                    <Settings size={15} /> Edit
                </Link>
            )}
        </div>
    );
}

function LockedBody({ capsule }) {
    return (
        <div className="space-y-6">
            <div className="card flex flex-col items-center gap-5 p-10 text-center">
                <p className="font-display text-lg text-capsule-parchmentDim">This capsule opens in</p>
                <Countdown unlockAt={capsule.unlock_at} />
                <p className="text-sm text-capsule-parchmentFaint">
                    {capsule.files_locked_count ?? 0} item{capsule.files_locked_count === 1 ? '' : 's'} sealed inside · unlocks{' '}
                    {new Date(capsule.unlock_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {capsule.can_contribute && <ContributeForm capsuleId={capsule.id} />}

            {capsule.is_owner && <RecipientsPanel capsule={capsule} />}
        </div>
    );
}

function UnlockedBody({ capsule }) {
    return (
        <div className="space-y-6">
            <div className="card flex items-center gap-3 border-l-4 border-l-capsule-teal p-4 text-sm text-capsule-parchmentDim">
                <WaxSeal size={28} locked={false} />
                Unlocked on {new Date(capsule.unlocked_at ?? capsule.unlock_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            <div className="space-y-4">
                {capsule.files.length === 0 ? (
                    <p className="py-8 text-center text-sm text-capsule-parchmentFaint">This capsule was sealed empty.</p>
                ) : (
                    capsule.files.map((file) => <FileEntry key={file.id} file={file} capsuleId={capsule.id} canDelete={capsule.is_owner} />)
                )}
            </div>

            {capsule.can_contribute && <ContributeForm capsuleId={capsule.id} title="Add to this open capsule" />}
        </div>
    );
}

function FileEntry({ file, capsuleId, canDelete }) {
    const Icon = typeIcons[file.type] ?? FileText;

    return (
        <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-capsule-parchmentFaint">
                    <Icon size={14} /> {file.type} · {file.uploader}
                </div>
                {canDelete && (
                    <button
                        onClick={() => {
                            if (confirm('Remove this item from the capsule?')) {
                                router.delete(route('capsules.files.destroy', [capsuleId, file.id]));
                            }
                        }}
                        className="text-capsule-parchmentFaint hover:text-capsule-rust"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            {file.type === 'message' ? (
                <p className="whitespace-pre-wrap font-display text-lg leading-relaxed">{file.body}</p>
            ) : file.type === 'photo' ? (
                <img src={file.url} alt={file.caption ?? file.original_name} className="max-h-[480px] w-full rounded-md object-contain" />
            ) : file.type === 'video' ? (
                <video src={file.url} controls className="w-full rounded-md" />
            ) : file.type === 'audio' ? (
                <audio src={file.url} controls className="w-full" />
            ) : (
                <a href={file.url} download className="flex items-center gap-2 text-sm text-capsule-brass hover:underline">
                    <Download size={16} /> {file.original_name} ({file.size})
                </a>
            )}

            {file.caption && file.type !== 'message' && (
                <p className="mt-2 text-sm text-capsule-parchmentDim">{file.caption}</p>
            )}
        </div>
    );
}

function ContributeForm({ capsuleId, title = 'Add something to this capsule' }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'message',
        body: '',
        caption: '',
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('capsules.files.store', capsuleId), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const kinds = [
        { key: 'message', label: 'Message', icon: MessageSquare },
        { key: 'photo', label: 'Photo', icon: Image },
        { key: 'video', label: 'Video', icon: Video },
        { key: 'audio', label: 'Audio', icon: Music },
        { key: 'document', label: 'Document', icon: FileText },
    ];

    return (
        <form onSubmit={submit} className="card space-y-4 p-6">
            <h2 className="font-display text-lg font-medium">{title}</h2>

            <div className="flex flex-wrap gap-2">
                {kinds.map((k) => (
                    <button
                        type="button"
                        key={k.key}
                        onClick={() => setData((d) => ({ ...d, type: k.key }))}
                        className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                            data.type === k.key
                                ? 'border-capsule-brass bg-capsule-panel2 text-capsule-brass'
                                : 'border-capsule-line text-capsule-parchmentDim hover:border-capsule-brass/50'
                        }`}
                    >
                        <k.icon size={13} /> {k.label}
                    </button>
                ))}
            </div>

            {data.type === 'message' ? (
                <div>
                    <textarea
                        rows={4}
                        placeholder="Write what you want your future self (or them) to read…"
                        className="field-input"
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                    />
                    <InputError message={errors.body} />
                </div>
            ) : (
                <div>
                    <input
                        type="file"
                        onChange={(e) => setData('file', e.target.files[0])}
                        className="block w-full text-sm text-capsule-parchmentDim file:mr-4 file:rounded-md file:border-0 file:bg-capsule-panel2 file:px-4 file:py-2 file:text-sm file:font-medium file:text-capsule-brass hover:file:bg-capsule-line"
                    />
                    <InputError message={errors.file} />
                    <TextInput
                        className="mt-3"
                        placeholder="Caption (optional)"
                        value={data.caption}
                        onChange={(e) => setData('caption', e.target.value)}
                    />
                </div>
            )}

            <div className="flex justify-end">
                <PrimaryButton disabled={processing}>Add to capsule</PrimaryButton>
            </div>
        </form>
    );
}

function RecipientsPanel({ capsule }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', role: 'viewer' });

    const submit = (e) => {
        e.preventDefault();
        post(route('capsules.recipients.store', capsule.id), { onSuccess: () => reset('email') });
    };

    return (
        <div className="card p-6">
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
                <h2 className="font-display text-lg font-medium">Recipients ({capsule.recipients.length})</h2>
                <UserPlus size={16} className="text-capsule-parchmentFaint" />
            </button>

            {open && (
                <div className="mt-4 space-y-4">
                    <ul className="space-y-2">
                        {capsule.recipients.map((r) => (
                            <li key={r.id} className="flex items-center justify-between rounded-md border border-capsule-line bg-capsule-panel2 px-3 py-2 text-sm">
                                <span>
                                    {r.email} <span className="text-xs text-capsule-parchmentFaint">· {r.role}{r.has_account ? '' : ' · pending signup'}</span>
                                </span>
                                <button
                                    onClick={() => router.delete(route('capsules.recipients.destroy', [capsule.id, r.id]))}
                                    className="text-capsule-parchmentFaint hover:text-capsule-rust"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={submit} className="flex gap-2">
                        <TextInput
                            type="email"
                            placeholder="email@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="field-input w-36"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="contributor">Contributor</option>
                        </select>
                        <GhostButton disabled={processing}>Add</GhostButton>
                    </form>
                    <InputError message={errors.email} />
                </div>
            )}
        </div>
    );
}

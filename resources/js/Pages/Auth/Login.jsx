import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Login({ canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout heading="Welcome back" sub="Sign in to reach your capsules.">
            <Head title="Sign in" />
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-capsule-parchmentDim">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-capsule-line bg-capsule-panel2 text-capsule-brass focus:ring-capsule-brass"
                        />
                        Remember me
                    </label>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="text-capsule-brass hover:underline">
                            Forgot password?
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    Sign in
                </PrimaryButton>

                <p className="text-center text-sm text-capsule-parchmentDim">
                    New here?{' '}
                    <Link href={route('register')} className="text-capsule-brass hover:underline">
                        Create an account
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}

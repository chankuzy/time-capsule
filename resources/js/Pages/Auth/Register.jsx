import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <GuestLayout heading="Seal your first memory" sub="It only takes a minute to get started.">
            <Head title="Create account" />
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput id="name" value={data.name} autoFocus autoComplete="name" onChange={(e) => setData('name', e.target.value)} />
                    <InputError message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" value={data.email} autoComplete="username" onChange={(e) => setData('email', e.target.value)} />
                    <InputError message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput id="password" type="password" value={data.password} autoComplete="new-password" onChange={(e) => setData('password', e.target.value)} />
                    <InputError message={errors.password} />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    Create account
                </PrimaryButton>

                <p className="text-center text-sm text-capsule-parchmentDim">
                    Already have an account?{' '}
                    <Link href={route('login')} className="text-capsule-brass hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}

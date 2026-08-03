import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <GuestLayout heading="Choose a new password">
            <Head title="Reset password" />
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    <InputError message={errors.email} />
                </div>
                <div>
                    <InputLabel htmlFor="password" value="New password" />
                    <TextInput id="password" type="password" autoFocus value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    <InputError message={errors.password} />
                </div>
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm new password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    <InputError message={errors.password_confirmation} />
                </div>
                <PrimaryButton className="w-full" disabled={processing}>
                    Reset password
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}

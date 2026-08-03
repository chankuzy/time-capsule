import { Head, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ForgotPassword() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout heading="Reset your password" sub="We'll email you a link to choose a new one.">
            <Head title="Forgot password" />
            {flash?.success && <p className="mb-4 text-sm text-capsule-teal">{flash.success}</p>}
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" value={data.email} autoFocus onChange={(e) => setData('email', e.target.value)} />
                    <InputError message={errors.email} />
                </div>
                <PrimaryButton className="w-full" disabled={processing}>
                    Send reset link
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}

export default function InputError({ message, className = '' }) {
    if (!message) return null;

    return <p className={`mt-1.5 text-sm text-capsule-rust ${className}`}>{message}</p>;
}

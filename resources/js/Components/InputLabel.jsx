export default function InputLabel({ value, children, className = '', ...props }) {
    return (
        <label {...props} className={`field-label ${className}`}>
            {value ?? children}
        </label>
    );
}

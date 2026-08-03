import { forwardRef } from 'react';

const TextInput = forwardRef(function TextInput({ className = '', ...props }, ref) {
    return <input {...props} ref={ref} className={`field-input ${className}`} />;
});

export default TextInput;

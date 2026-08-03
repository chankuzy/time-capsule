/**
 * The signature element of the product: a sealing-wax stamp.
 * Locked capsules show a raised, closed seal; unlocked ones show it broken open.
 */
export default function WaxSeal({ locked = true, size = 44, initial = '' }) {
    const dimension = size;

    return (
        <div
            className="wax-seal shrink-0"
            style={{ width: dimension, height: dimension }}
            aria-hidden="true"
        >
            {locked ? (
                <svg viewBox="0 0 24 24" width={dimension * 0.5} height={dimension * 0.5} fill="none">
                    <path
                        d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                    />
                    {initial && (
                        <text
                            x="12"
                            y="15"
                            textAnchor="middle"
                            fontSize="7"
                            fontFamily="Fraunces, serif"
                            fill="currentColor"
                        >
                            {initial}
                        </text>
                    )}
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" width={dimension * 0.5} height={dimension * 0.5} fill="none">
                    <path
                        d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                        strokeDasharray="2 2"
                    />
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
    );
}

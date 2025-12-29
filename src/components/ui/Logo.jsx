const Logo = ({ size = 32, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Background Circle with Gradient */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B4A" />
                    <stop offset="100%" stopColor="#FF8A6F" />
                </linearGradient>
                <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4FACFE" />
                    <stop offset="100%" stopColor="#00F2FE" />
                </linearGradient>
            </defs>
            
            {/* Outer Circle */}
            <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" />
            
            {/* Pulse Wave 1 */}
            <circle cx="32" cy="32" r="22" fill="none" stroke="url(#pulseGradient)" strokeWidth="2" opacity="0.6" />
            
            {/* Pulse Wave 2 */}
            <circle cx="32" cy="32" r="18" fill="none" stroke="url(#pulseGradient)" strokeWidth="2" opacity="0.8" />
            
            {/* Center Heart/Pulse Icon */}
            <path
                d="M32 24C32 24 28 20 24 20C20 20 18 22 18 26C18 30 24 36 32 44C40 36 46 30 46 26C46 22 44 20 40 20C36 20 32 24 32 24Z"
                fill="white"
                opacity="0.95"
            />
            
            {/* Pulse Lines */}
            <path
                d="M20 32L24 28L28 32L32 28L36 32L40 28L44 32"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
            />
        </svg>
    );
};

export default Logo;


const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    onClick,
    className = '',
    icon: Icon
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] text-white shadow-lg shadow-[#FF6B4A]/25 hover:shadow-xl hover:shadow-[#FF6B4A]/35',
        action: 'bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6F] text-white shadow-lg shadow-[#FF6B4A]/25 hover:shadow-xl hover:shadow-[#FF6B4A]/35',
        secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
        outline: 'border-2 border-[#FF6B4A] text-[#FF6B4A] hover:bg-[#FF6B4A]/10',
        ghost: 'text-white/70 hover:bg-white/10 hover:text-white'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

export default Button;

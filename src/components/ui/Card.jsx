const Card = ({
    children,
    className = '',
    onClick,
    padding = true,
    hover = false
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        bg-[#141416] rounded-xl border border-white/5 overflow-hidden transition-all duration-200
        ${hover ? 'hover:border-white/10 hover:bg-[#1C1C1E] active:scale-[0.98] cursor-pointer' : ''}
        ${padding ? 'p-4' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;

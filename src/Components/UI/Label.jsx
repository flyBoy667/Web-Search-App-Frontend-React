export const Label = ({htmlFor, className = "", children, ...props}) => (
    <label
        htmlFor={htmlFor}
        className={`block text-sm font-medium text-gray-700 ${className}`}
        {...props}
    >
        {children}
    </label>
);


const RadioGroup = ({className = "", children, ...props}) => {
    return (
        <div
            className={`grid gap-2 ${className}`}
            role="radiogroup"
            {...props}
        >
            {children}
        </div>
    )
}

const RadioGroupItem = ({className = "", id, ...props}) => {
    return (
        <div className="flex items-center gap-2">
            <input
                type="radio"
                id={id}
                className={`
          h-4 w-4 rounded-full border border-primary 
          focus:outline-none focus:ring-2 focus:ring-primary
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
                {...props}
            />
            <div className="radio-indicator hidden peer-checked:block">
                <div className="h-2 w-2 rounded-full bg-primary"/>
            </div>
        </div>
    )
}

export {RadioGroup, RadioGroupItem}
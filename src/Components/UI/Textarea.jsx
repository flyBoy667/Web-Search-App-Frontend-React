const Textarea = ({className = "", ...props}) => {
    return (
        <textarea
            className={`
        block min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2
        text-sm text-gray-900 placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:cursor-not-allowed disabled:opacity-50
        dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
        ${className}
      `}
            {...props}
        />
    )
}

Textarea.displayName = "Textarea"

export {Textarea}
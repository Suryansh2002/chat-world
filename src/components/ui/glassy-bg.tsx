export function GlassyBackground({children, className}:{children:React.ReactNode, className?:string}) {
    return (
        <div className={`bg-zinc-800 bg-opacity-30 backdrop-blur-sm ${className}`}>
            {children}
        </div>
    )
}
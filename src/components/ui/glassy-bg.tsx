export function GlassyBackground({children, className}:{children:React.ReactNode, className?:string}) {
    return (
        <div className={`bg-zinc-900 bg-opacity-30 backdrop-blur-sm shadow-[0_4px_35px_rgba(255,255,255,0.15)] ${className}`}>
            {children}
        </div>
    )
}
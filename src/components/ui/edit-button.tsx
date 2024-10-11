import Image from "next/image"
import { cn } from "@/lib/utils"

export function EditButton({
        onClick,
        className
    }:{
        onClick:()=>void,
        className?:string
    }) {
    return <button 
        onClick={onClick}
        className={cn("bg-green-500 p-2 rounded-lg hover:bg-green-600 bg-opacity-60 border-2 border-gray-400",className)}
    >
        <Image src="/edit.svg" alt="edit" height={20} width={20}/>    
    </button>
}
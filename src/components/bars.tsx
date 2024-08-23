"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../lib/utils";

const links = [
    {label:"friends", href:"/app/friends", icon:"/friends.svg"},
]

export function Links() {
    const pathname = usePathname();
    return links.map(link=>{
        return <Link href={link.href} key={link.href}>
            <Image src={link.icon} alt={link.label} width={50} height={50} className={cn(
                "rounded-lg hover:bg-black",
                {"bg-neutral-950":pathname===link.href},
            )}/>
        </Link>
    })
}


export function Sidebar() {
    return <div className="h-full w-16 bg-neutral-800 flex flex-col justify-center items-center rounded-lg">
        <Links/>
    </div>
}


export function ButtonBar() {
    return <div className="h-16 w-[100%] bg-neutral-800 flex items-center justify-center rounded-lg">
        <Links/>
    </div>
}


export  function Bar() {
    return <>
        <div className="hidden md:block">
            <Sidebar/>
        </div>
        <div className="block md:hidden">
            <ButtonBar/>
        </div>
    </>
}
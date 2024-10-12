"use client";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../lib/utils";

const links = [
    {label:"friends", href:"/app/friends", icon:"/friends.svg" , className: "scale-125"},
    {label: "manage friends", href:"/app/manage-friends", icon:"/add-friends.svg" , className: "scale-75"},
    {label: "settings", href:"/app/settings", icon:"/settings.svg" , className: "scale-100"},
]

export function Links() {
    const params = useParams();
    let pathname = usePathname();
    for (let [_, value] of Object.entries(params)) {
        if (pathname.includes(`/${value}`)){
            pathname = pathname.replace(`/${value}`,"");
        }
    }
    return links.map(link=>{
        return <Link href={link.href} key={link.href} className={cn("rounded-lg bg-zinc-600 hover:bg-zinc-500", {
            "bg-zinc-400": pathname === link.href
        })}>
            <Image src={link.icon} alt={link.label} width={50} height={50} className={link.className} priority/>
        </Link>
    })
}

export function Sidebar() {
    return <div className="hidden md:block">
        <aside className="h-full w-16 bg-zinc-800 flex flex-col justify-around items-center rounded-lg">
            <Links/>
        </aside>
    </div>
}


export function Bottombar() {
    return <div className="block md:hidden">
        <footer className="h-16 w-[100%] bg-zinc-800 flex items-center justify-around rounded-lg">
            <Links/>
        </footer>
    </div>
}
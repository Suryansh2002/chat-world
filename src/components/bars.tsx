"use client";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "../lib/utils";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { GiRadarSweep } from "react-icons/gi";


const links = [
    {label:"friends", href:"/app/friends", icon:<LiaUserFriendsSolid className="h-12 w-12 p-2"/>},
    {label: "nearby", href:"/app/nearby", icon: <GiRadarSweep className="h-12 w-12 p-2"/>},
    {label: "manage friends", href:"/app/manage-friends", icon: <IoPersonAddOutline className="h-12 w-12 p-2"/>},
    {label: "settings", href:"/app/settings", icon: <IoSettingsOutline className="h-12 w-12 p-2"/>},
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
            "bg-zinc-400 bg-opacity-70": pathname === link.href
        })}>
            {link.icon}
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
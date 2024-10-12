import {Sidebar, Bottombar} from "@/components/bars"

export default function Layout({children}: {children: React.ReactNode}) {
    return <div className="max-h-screen h-screen w-screen flex flex-col md:flex-row gap-1 overflow-hidden">
        <Sidebar/>
        {children}
        <Bottombar/>
    </div>
}
import {Bar} from "@/components/bars"

export default function Layout({children}: {children: React.ReactNode}) {
    return <>
        <div className="hidden md:block">
            <div className="h-screen w-screen flex gap-1">
                <Bar/>
                {children}
            </div>
        </div>
        <div className="block md:hidden">
            <div className="h-screen w-screen flex flex-col gap-1">
                {children}
                <Bar/>
            </div>
        </div>
    </>
}
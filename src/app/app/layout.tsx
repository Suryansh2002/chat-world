import {Bar} from "@/components/bars"

export default function Layout({children}: {children: React.ReactNode}) {
    return <>
        <div className="hidden md:block">
            <div className="max-h-screen h-screen w-screen flex gap-1 overflow-hidden">
                <Bar/>
                {children}
            </div>
        </div>
        <div className="block md:hidden">
            <div className="max-h-screen h-screen w-screen flex flex-col gap-1 overflow-hidden">
                {children}
                <Bar/>
            </div>
        </div>
    </>
}
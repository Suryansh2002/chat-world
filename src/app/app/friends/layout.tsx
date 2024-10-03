import { Suspense } from "react";
import { FriendsList } from "@/components/friends/list";
export default function Layout({children}:{children: React.ReactNode}) {
    return <div className="h-full w-full flex gap-1 overflow-hidden">
        <Suspense fallback={<></>}>
            <FriendsList className="md:max-w-36" buttons={false}/>
        </Suspense>
        {children}
    </div>
}
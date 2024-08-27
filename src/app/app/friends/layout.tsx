import { FriendsList } from "@/components/friends/list";
export default function Layout({children}:{children: React.ReactNode}) {
    return <div className="h-full flex gap-1">
        <FriendsList className="md:max-w-36" buttons={false}/>
        {children}
    </div>
}
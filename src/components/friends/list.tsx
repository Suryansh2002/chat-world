"use client"
import { Avatar } from "@nextui-org/avatar";
import { useRef, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Mode } from "@/lib/types";
import { type FriendType } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { fetchFriends, fetchIncoming, fetchOutgoing, unfriend, acceptRequest, cancelRequest } from "@/actions/friends";
import { friendsStore } from "@/lib/store";

const fetchFunctions = {
    Friends: fetchFriends,
    Incoming: fetchIncoming,
    Outgoing: fetchOutgoing,
}

function CommonButton({ 
        children,
        action,
        id, 
        refetch, 
        setMessage,
        success, 
        className 
    }: { 
        children: React.ReactNode,
        action: Function,
        id: string,
        refetch: Function,
        setMessage: React.Dispatch<React.SetStateAction<string>>,
        success: React.MutableRefObject<boolean>,
        className?: string 
    }) {
    async function handleClick() {
        const result = await action({ id });
        if (result?.serverError) {
            success.current = true
            setMessage(result.serverError);
        }
        else if (result?.data) {
            success.current = false
            setMessage(result.data);
        }
        refetch(3);
    }
    return <Button className={`rounded-md w-10 scale-90 ${className || ""}`} onClick={handleClick}>{children}</Button>
}

function FriendAs({as, children, className, href, key}:{as: "div"|"link", children:React.ReactNode, className:string, href:string, key:string}) {
    if (as === "div"){
        return <div className={className}>
            {children}
        </div>
    }
    return <Link href={href} key={key} className={className}>
        {children}
    </Link>
}


function Friend({ friend, fetchCallback, type, buttons }: { friend: FriendType, fetchCallback: Function, type: Mode, buttons: boolean }) {
    const successRef = useRef(false);
    const [message, setMessage] = useState("");
    const as = usePathname().includes("/app/friends") ? "link" : "div";

    if (message) {
        let className = "";
        if (successRef.current) {
            className = "text-emerald-500 border-2 border-emerald-500";
        } else {
            className = "text-red-400 border-2 border-red-400";
        }
        return <div className={`flex items-center justify-center bg-neutral-900 p-1 md:w-full w-[90%] rounded-md ${className}`}>
            {message}
        </div>
    }

    return <FriendAs as={as} href={`/app/friends/${friend.id}`} key={friend.id} className={`flex bg-neutral-900 p-1 rounded-md hover:bg-neutral-950 hover:rounded-lg md:w-full w-[90%] justify-between`}>
        <div className="flex gap-2 overflow-hidden">
            <Avatar src={friend.imageUrl} name={friend.displayName} className="scale-90" />
            <div className="flex-1 py-2 text-center overflow-hidden text-ellipsis md:text-sm">{friend.displayName}</div>
        </div>
        {
            buttons && type === "Friends"
            &&
            <CommonButton className="bg-red-500" id={friend.id} refetch={fetchCallback} action={unfriend} success={successRef} setMessage={setMessage}>
                Unfriend
            </CommonButton>
        }
        {
            buttons && type === "Incoming"
            &&
            <CommonButton className="bg-emerald-500" id={friend.id} refetch={fetchCallback} action={acceptRequest} success={successRef} setMessage={setMessage} >
                Accept
            </CommonButton>
        }
        {
            buttons && type === "Outgoing"
            &&
            <CommonButton className="bg-red-500" id={friend.id} refetch={fetchCallback} action={cancelRequest} success={successRef} setMessage={setMessage}>
                Cancel
            </CommonButton>
        }
    </FriendAs>
}

export function FriendsList({ type = "Friends", className, buttons = true }: { className?: string, type?: Mode, buttons?: boolean }) {
    const params = useParams();
    if ("id" in params) {
        className = cn(className, "hidden md:block");
    }
    const { userRelations, setUserRelations } = friendsStore();

    const ref = useRef<Mode>(type);

    const fetchCallback = async(delay?:number) => {
        await new Promise((resolve) => setTimeout(resolve, (delay || 0)*1000));
        const data = await fetchFunctions[type]();
        if(ref.current !== type){
            return;
        }
        setUserRelations({ [type]: data?.data || [] });
    }

    useEffect(() => {
        ref.current = type;
        fetchCallback();
    }, [type]);

    return <div className={`h-full min-w-28 w-full bg-neutral-800 p-1 gap-2 flex flex-col rounded-lg items-center overflow-y-auto scrollbar-hide ${className || ""}`}>
        {
            userRelations[type].map((friend) => <Friend key={friend.id} friend={friend} fetchCallback={fetchCallback} type={type} buttons={buttons} />)
        }
    </div>
}

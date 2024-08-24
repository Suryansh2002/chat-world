"use client"
import { Avatar } from "@nextui-org/avatar";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Mode } from "@/lib/types";
import { fetchFriends, fetchIncoming, fetchOutgoing, unfriend, acceptRequest, cancelRequest } from "@/actions";

//I will improve these buttons later
function UnfriendButton({ id, refetch }: { id: string, refetch: Function }) {
    async function handleClick() {
        const result = await unfriend({ id });
        if (result?.serverError) {
            alert(result.serverError);
        }
        else if (result?.data) {
            alert(result.data);
        }
        refetch();
    }
    return <Button className="bg-red-500 rounded-md w-10 scale-90 right-0" onClick={handleClick}>Unfriend</Button>
}

function AcceptButton({ id, refetch }: { id: string, refetch: Function }) {
    async function handleClick() {
        const result = await acceptRequest({ id });
        if (result?.serverError) {
            alert(result.serverError);
        }
        else if (result?.data) {
            alert(result.data);
        }
        refetch();
    }
    return <Button className="bg-emerald-500 rounded-md w-10 scale-90 right-0" onClick={handleClick}>Accept</Button>
}

function CancelButton({ id, refetch }: { id: string, refetch: Function }) {
    async function handleClick() {
        const result = await cancelRequest({ id });
        if (result?.serverError) {
            alert(result.serverError);
        }
        else if (result?.data) {
            alert(result.data);
        }
        refetch();
    }
    return <Button className="bg-red-500 rounded-md w-10 scale-90 right-0" onClick={handleClick}>Cancel</Button>
}

const fetchFunctions = {
    Friends: fetchFriends,
    Incoming: fetchIncoming,
    Outgoing: fetchOutgoing,
}

export function FriendsList({ type = "Friends", className, buttons = true }: { className?: string, type?: Mode, buttons?: boolean }) {
    const [friends, setFriends] = useState<{ id: string, displayName: string, imageUrl: string }[]>([]);
    const fetchCallback = () => {
        fetchFunctions[type]().then(data => setFriends(data?.data || []));
    }
    useEffect(() => {
        setFriends([]);
        fetchCallback();
    }, [type]);
    return <div className={`h-full min-w-28 w-full bg-neutral-800 p-1 flex flex-col rounded-lg items-center overflow-y-auto scrollbar-hide ${className || ""}`}>
        {
            friends.map((friend) => {
                return <div key={friend.id} className={`flex bg-neutral-900 p-1 rounded-md hover:bg-neutral-950 hover:rounded-lg md:w-full w-[90%] justify-between`}>
                    <div className="flex gap-2 overflow-hidden">
                        <Avatar src={friend.imageUrl} name={friend.displayName} className="scale-90" />
                        <div className="flex-1 py-2 text-center overflow-hidden text-ellipsis md:text-sm">{friend.displayName}</div>
                    </div>
                    {buttons && type === "Friends" && <UnfriendButton id={friend.id} refetch={fetchCallback} />}
                    {buttons && type === "Incoming" && <AcceptButton id={friend.id} refetch={fetchCallback} />}
                    {buttons && type === "Outgoing" && <CancelButton id={friend.id} refetch={fetchCallback} />}
                </div>
            })
        }
    </div>
}

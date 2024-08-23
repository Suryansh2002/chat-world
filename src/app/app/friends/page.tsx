"use client"
import { fetchFriends } from "@/actions";
import { Avatar } from "@nextui-org/avatar";
import { useEffect, useState } from "react";


function FriendsList(){
    const [friends, setFriends] = useState<{displayName:string, imageUrl:string}[]>([]);
    useEffect(()=>{
        fetchFriends().then(data=>setFriends(data?.data || []))
    },[]);
    return <div className="h-full min-w-28 md:max-w-36 w-full bg-neutral-800 p-1 flex flex-col rounded-lg items-center">
        {   
            friends.map((friend)=>{
                return <div className="flex bg-neutral-900 p-1 rounded-md hover:bg-neutral-950 hover:rounded-xl md:w-full w-[90%] ">
                    <Avatar src={friend.imageUrl} name={friend.displayName} className="scale-90"/>
                    <div className="flex-1 py-2 text-center overflow-hidden text-ellipsis md:text-sm">{friend.displayName}</div>
                </div>
            })
        }
    </div>
}


export default function Page(){
    return <div className="h-full">
        <FriendsList/>
    </div>
}
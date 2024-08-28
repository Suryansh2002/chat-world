"use client";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { FriendsList } from "@/components/friends/list";
import { AddFriendModal } from "@/components/friends/add-modal";
import { Mode, ModeList } from "@/lib/types";

export default function Page(){
    const [mode, setMode] = useState<Mode>("Friends");
    const [addFriendMode, setAddFriendMode] = useState(false);
    const modes:ModeList = ["Friends", "Incoming", "Outgoing"];
    
    return <div className="h-full w-full flex flex-col gap-4 items-center justify-center relative">
        <div className="h-5/6 md:w-1/2 w-5/6 border-2 border-neutral-700 bg-gradient-to-b from-neutral-800 to-zinc-950 rounded-2xl flex flex-col p-4 gap-2">
            <div className="flex justify-around gap-6">
                {
                    modes.map((mode)=>{
                        return <Button key={mode} onClick={()=>{
                            setMode(mode);
                            setAddFriendMode(false);
                        }} className="bg-emerald-500 rounded-md w-full font-semibold text-small">{mode}</Button>
                    })
                }
            </div>
            <hr className="w-full"/>
            <FriendsList type={mode}/>
        </div>
        {mode=="Outgoing" && <Button className="bg-blue-500 rounded-md w-10 right-0 px-11 py-3" onClick={()=>setAddFriendMode(true)}>Add Friend</Button>}
        {addFriendMode && <AddFriendModal setMode={setAddFriendMode}/>}
    </div>
}
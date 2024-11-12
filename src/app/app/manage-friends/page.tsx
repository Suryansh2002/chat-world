"use client";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { FriendsList } from "@/components/friends/list";
import { AddFriendModal } from "@/components/friends/add-modal";
import type { Mode, ModeList } from "@/lib/types";
import { Suspense } from "react";

export default function Page(){
    const [mode, setMode] = useState<Mode>("Friends");
    const [addFriendMode, setAddFriendMode] = useState(false);
    const modes:ModeList = ["Friends", "Incoming", "Outgoing"];
    
    return <div className="h-full w-full flex flex-col gap-4 items-center justify-center relative">
        <div className="h-5/6 md:w-1/2 w-5/6 border-2 border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-2xl flex flex-col p-4 gap-2">
            <div className="flex justify-around gap-6">
                {
                    modes.map((mode_item)=>{
                        return <Button key={mode_item} onClick={()=>{
                            setMode(mode_item);
                            setAddFriendMode(false);
                        }} className={`${mode_item==mode?"bg-emerald-600":"bg-emerald-500"} rounded-md flex-1 font-semibold text-small p-0`}>{mode_item}</Button>
                    })
                }
            </div>
            <hr className="w-full"/>
            <Suspense fallback={<></>}>
                <FriendsList type={mode}/>
            </Suspense>
        </div>
        {mode=="Outgoing" && <Button className="bg-blue-500 rounded-md w-10 right-0 px-11 py-3" onClick={()=>setAddFriendMode(true)}>Add Friend</Button>}
        {addFriendMode && <AddFriendModal setMode={setAddFriendMode}/>}
    </div>
}
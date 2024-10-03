'use client';
import { fetchFriendMessages } from "@/actions/friends";
import { ShowMessages } from "@/components/chat/show-messages";
import { SendMessage } from "@/components/chat/send-messages";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";
import { useState, useEffect } from "react";
import type { FetchMessage } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Main() {
    const [searchId, setId] = useState<string|null>(null);
    const [result, setResult] = useState<{messages:FetchMessage[], channelId:string|undefined}>({
        messages:[],
        channelId:undefined
    });

    const searchParams = useSearchParams();
    useEffect(()=>{
        setId(searchParams.get("id"));
    },[searchParams])

    useEffect(()=>{
        setResult({messages:[],channelId:undefined});
        if (!searchId){
            return;
        }
        fetchFriendMessages({friendId:searchId}).then((data)=>{
            data?.data && setResult(data.data);
        });
    },[searchId])
    
    if (!searchId){
        return <></>
    }
    
    if (!result.channelId){
        return <ChatSkeleton/>
    }
    
    return <div className="flex flex-col h-full w-full bg-zinc-800 rounded-lg pb-2 items-center overflow-hidden">
        <ShowMessages messages={result.messages} channelId={result.channelId} />
        <SendMessage channelId={result.channelId} />
    </div>
}


export default function Page(){
    return <Suspense fallback={<ChatSkeleton/>}>
        <Main/>
    </Suspense>
}
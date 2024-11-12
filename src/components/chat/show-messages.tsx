"use client";
import type { FetchMessage } from "@/lib/types";
import { useRef, useEffect, useState } from "react";
import { Avatar } from "@nextui-org/avatar";
import { useStateFulMessages } from "@/components/chat/chat-hook";

export function ShowMessages({messages,channelId}:{messages:FetchMessage[], channelId:string}){
    const stateFulMessages = useStateFulMessages(messages, channelId);

    const messagesRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if (messagesRef.current){
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    },[stateFulMessages]);

    return <div className="overflow-x-hidden overflow-y-scroll scrollbar-hide flex-1 pb-1 gap-2 w-full" ref={messagesRef}>
        {
            stateFulMessages.map((message,index)=>{
                const showExtra = index === 0 || stateFulMessages[index-1].senderId !== message.senderId;
                return <div key={index} className="flex gap-1 px-2 p-1 rounded-md hover:bg-zinc-700 relative">
                    {showExtra && <Avatar src={message.imageUrl} className="absolute self-center hover:scale-110 transition-all duration-700" as="button"/>}
                    <div className="pl-12 flex flex-col gap-1">
                        {
                            showExtra && <div className="pl-1 font-semibold text-sm text-white">{message.sender}</div>
                        }
                        <div className="text-white text-sm px-1">{message.message}</div>
                    </div>
                </div>
            })
        }
    </div>
}
"use client";
import { FetchMessage } from "@/lib/types";
import { useRef, useEffect } from "react";
import { Avatar } from "@nextui-org/avatar";
import { useState } from "react";
import { socket } from "@/app/socket";

export function ShowMessages({messages,channelId}:{messages:FetchMessage[], channelId:string}){
    const [stateFulMessages, setMessages] = useState(messages);
    socket.on("message", (message)=>{
        if (message.channelId !== channelId){
            return;
        }
        setMessages([...stateFulMessages,message]);
    });

    const messagesRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if (messagesRef.current){
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    },[stateFulMessages]);

    return <div className="overflow-x-hidden overflow-y-scroll scrollbar-hide flex-1 p-1 gap-2 w-full" ref={messagesRef}>
        {
            stateFulMessages.map((message,index)=>{
                const showExtra = index === 0 || stateFulMessages[index-1].senderId !== message.senderId;
                return <div key={index} className="flex gap-1 p-1 rounded-md hover:bg-neutral-700 relative">
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
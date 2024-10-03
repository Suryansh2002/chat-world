"use client";
import type { FetchMessage } from "@/lib/types";
import { useRef, useEffect } from "react";
import { Avatar } from "@nextui-org/avatar";
import { useState } from "react";
import { socket } from "@/app/socket";
import { TypingMotion } from "../ui/typing-motion";

export function ShowMessages({messages,channelId}:{messages:FetchMessage[], channelId:string}){
    const [stateFulMessages, setMessages] = useState(messages);
    const [typingWho, setTypingWho] = useState<string|null>();
    const timeout = useRef<NodeJS.Timeout|null>(null);

    socket.on("message", (message)=>{
        if (message.channelId !== channelId){
            return;
        }
        setMessages([...stateFulMessages,message]);
    });

    socket.emit("sendJoinChannel",channelId);

    socket.on("typingPing", (who, socketChannelId)=>{
        if (channelId !== socketChannelId){
            return;
        }
        if (typingWho && timeout.current){
            clearTimeout(timeout.current);
            timeout.current = null;
        }
        setTypingWho(who);
        timeout.current = setTimeout(()=>{
            setTypingWho(null);
        },3000);
    });

    const messagesRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if (messagesRef.current){
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    },[stateFulMessages]);

    return <div className="overflow-x-hidden overflow-y-scroll scrollbar-hide flex-1 pb-1 gap-2 w-full" ref={messagesRef}>
        <div className="w-full h-10 bg-neutral-900 bg-opacity-80 flex justify-between p-2">
            {
                typingWho ? <div className="text-white text-xs font-bold px-1">{typingWho} is Typing<TypingMotion/> </div> : <></>
            }
        </div>
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
"use client";

import { SendGlobalMessage } from "@/components/chat/send-messages"
import { ShowGlobalMessages } from "@/components/chat/show-messages"
import { socket } from "@/app/socket"
import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page(){
    const router = useRouter();

    const sendLocation = useCallback((position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        socket.emit("sendLocation", { latitude, longitude });
    }, []);
    const handleLocationError = useCallback((error: GeolocationPositionError) => {
        alert(`Failed to get location !\nLocation is needed for sending messages !`);
        router.replace("/app/friends");
    }, []);

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(sendLocation, handleLocationError, {enableHighAccuracy: true})
    }, [])
    return <div className="flex flex-col h-full w-full bg-zinc-800 rounded-lg pb-2 items-center overflow-hidden">
        <ShowGlobalMessages />
        <SendGlobalMessage />
    </div>
}
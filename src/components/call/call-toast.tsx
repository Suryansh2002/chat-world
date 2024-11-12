"use client";

import { useState, useEffect, useRef, MutableRefObject } from "react";
import Image from "next/image";
import { socket } from "@/app/socket";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { callStore } from "@/lib/store";
import type { RTCUser } from "@/lib/types";
import { useRTC, RTCConnectionContext } from "@/lib/contexts";

function Toast({
    details:{offer, user},
    setData,
}: {
    details:{
        offer:RTCSessionDescriptionInit,
        user: RTCUser
    },
    setData:React.Dispatch<React.SetStateAction<any>>,
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const rtc = useRTC()
    const [className, setClassName] = useState('');
    const {setCallType} = callStore();

    const handleAnswer = async ()=>{
        if (!rtc.current) return;
        rtc.current.setRemoteDescription(offer);
        const answer = await rtc.current.createAnswer();
        rtc.current.setLocalDescription(answer);
        console.log("set local, remote set",rtc.current.signalingState);
        setCallType(user.callType);
        socket.emit("sendAnswer",answer,user.id);

        if (pathname !== "/app/friends"){
            router.push(`/app/friends?id=${user.id}`);
        } else {
            if (searchParams.get("id") !== user.id){
                router.push(`/app/friends?id=${user.id}`);
            }
        }
        handleClose();
    }

    const handleClose = ()=>{
        setClassName("-translate-y-[150%] opacity-0");
        setTimeout(()=>{
            setData(null);
        },500)
    }
    return (
        <div className={`fixed z-10 flex flex-col items-center gap-2 top-2 left-1/2 max-w-[200px] w-3/4 p-3 bg-zinc-950 border border-gray-400 shadow-sm font-medium rounded-lg -translate-x-1/2 transition-all duration-500 ${className}`}>
            {/* {user.imageUrl && <Image src={user.imageUrl} alt={user.displayName} height={50} width={50} className="rounded-full"/>} */}
            <p>{user.displayName} is calling you</p>
            <div className="flex gap-2 justify-around w-full px-6">
                <button className=" bg-green-500 rounded-lg border border-green-400 p-2 text-xs" onClick={handleAnswer}>
                    <Image src="/call-accept.svg" alt="call-accept" height={20} width={20}/>
                </button>
                <button className="bg-red-500  rounded-lg border border-red-400 p-2 text-xs" onClick={handleClose}>
                    <Image src="/call-reject.svg" alt="call-reject" height={20} width={20}/>
                </button>
            </div>
        </div>
    );
}

export function CallToast() {
    const [data, setData] = useState<{
        offer:RTCSessionDescriptionInit,
        user: RTCUser
    }|null>(null);

    useEffect(()=>{
        socket.on("offer",(offer,user)=>{
            setData({offer,user});
        });
        return ()=>{
            socket.off("offer");
        }
    },[]);

    if (data){
        return <Toast details={data} setData={setData}/>
    }
    return <></>;
}

export function RTCProvider({children}: { children: React.ReactNode }) {
    const rtcRef:MutableRefObject<RTCPeerConnection|null> = useRef(null);
    if (typeof window !== "undefined"){
        if (!rtcRef.current){
            console.log("a new rtc connection has been created");
            rtcRef.current = new RTCPeerConnection();
            window.rtc = rtcRef.current;
        }
    } 
    return (
        <RTCConnectionContext.Provider value={rtcRef}>
            <CallToast/>
            {children}
        </RTCConnectionContext.Provider>
    )
}
import { friendsStore } from "@/lib/store"
import { useRTC } from "@/lib/contexts";
import { useEffect, useRef } from "react";
import { socket } from "@/app/socket";
import { callStore } from "@/lib/store";
import { Avatar } from "@nextui-org/avatar";
import { motion } from "framer-motion";
import type { FriendType } from "@/lib/types";


export function CallData({callType,friend,connection}:{callType:"call"|"videoCall", connection:RTCPeerConnection, friend:FriendType}) {
    const localVideoStream = useRef<MediaStream>();
    const remoteVideoStream = useRef<MediaStream>();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(()=>{
        if (callType === "videoCall"){
            navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
                localVideoStream.current = stream;
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
                stream.getTracks().forEach((track)=>{
                    console.log("Adding local track");
                    connection.addTrack(track, stream);
                });
            });

            connection.ontrack = (event)=>{
                console.log("Adding remote stream");
                remoteVideoStream.current = event.streams[0];
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            }
        }

        return ()=>{
            console.log("ending");
            localVideoStream.current?.getTracks().forEach((track)=>track.stop());
            remoteVideoStream.current?.getTracks().forEach((track)=>track.stop());
        }
    },[callType])

    if (callType === "call"){
        return <div className="relative p-4">
            <motion.div 
                className="absolute insert-0 h-40 w-40 bg-gray-600 rounded-full"
                animate={{scale:[1.1,1.2,1]}}
                transition={{duration:1, repeat:Infinity}}
            />
            <Avatar src={friend.imageUrl} className="relative h-40 w-40 "/>
        </div>
    } else if (callType === "videoCall") {
        return <div className="flex flex-col items-center gap-2">
            <div className="w-full h-full flex justify-center items-center">
                <video ref={localVideoRef} autoPlay muted/>
                <video ref={remoteVideoRef} autoPlay/>
            </div>
        </div>
    }
    return <></>
}

export function Call({
        friendId
    }:{
        friendId:string
    }) {
    const {userRelations} = friendsStore();
    const {callType, setCallType} = callStore();
    const friend = userRelations.Friends.find((friend)=>friend.id === friendId);
    const rtc = useRTC();

    function endCall(){
        rtc.current?.close();
        rtc.current = new RTCPeerConnection();
        setCallType(null);
    }
    
    useEffect(()=>{
        console.log(friendId, callType);
        if (!friend || !callType || !rtc.current){
            return;
        }
        console.log("Signaling state",rtc.current.signalingState);  
        if (rtc.current.signalingState !== "stable"){
            return;
        }

        rtc.current.createOffer().then((offer)=>{
            rtc.current?.setLocalDescription(offer);
            console.log(rtc.current?.signalingState,"sent offer");
            socket.emit("sendOffer", offer, friendId, callType);
        });

        socket.on("answer", (answer, userId)=>{
            if (userId !== friendId){
                return;
            }
            if (rtc.current?.signalingState === "stable"){
                return;
            }
            rtc.current?.setRemoteDescription(answer);
            console.log("Answer set without errors !")
        });

        return ()=>{
            socket.off("answer");
        }
    },[friendId, callType])


    if (!friend || !callType){
        return <></>
    }

    return <div className="bg-neutral-900 bg-opacity-60 flex flex-col items-center border-2 border-gray-700 rounded-xl gap-2 p-2">
        <h2 className="text-2xl font-bold">{callType[0].toUpperCase()+callType.slice(1)}ing {friend.displayName}</h2>
        {rtc.current && <CallData callType={callType} connection={rtc.current} friend={friend}/>}
        <button onClick={endCall} className="border-2 border-red-600 px-4 py-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20">End call</button>
    </div>
}
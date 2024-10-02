"use client";
import Image from "next/image"
import {socket} from "@/app/socket";

export function SendMessage({channelId}:{channelId:string}){
    const handleSumit = async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        event.currentTarget.reset();
        const message = formData.get("message") as string;
        socket.emit("sendMessage", channelId, message);
    }

    return <form className="flex md:w-[80%] w-[95%] bg-zinc-700 p-1 rounded-xl" onSubmit={handleSumit}>
        <input className="bg-transparent focus:outline-none flex-1 p-2 text-white focus:bg-transparent" name="message"/>
        <button>
            <Image src={"/send.svg"} alt="send" height={45} width={45}/>
        </button>
    </form>
}
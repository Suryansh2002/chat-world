import { TypingMotion } from "./ui/typing-motion";
import { useTypingWho } from "./chat/chat-hook";
import { callStore } from "@/lib/store";

export function ChatNav({
        channelId,
        children
    }:{
        channelId:string,
        children:React.JSX.Element,
    }) {

    const typingWho = useTypingWho(channelId);
    const {setCallType} = callStore();

    return <div className="w-full flex flex-col">
        <div className="bg-neutral-900 bg-opacity-90 grid grid-cols-3 md:px-8 px-3">
            <div className="flex items-center">
            {
                typingWho ? <div className="text-white text-xs font-bold px-1">{typingWho} is Typing<TypingMotion/> </div> : <></>
            }
            </div>
            <div></div>
            <div className="flex items-center justify-end p-2 gap-4">
                <button onClick={()=>{setCallType("call")}}>
                    <img src="/call.svg" alt="call" className="h-10 w-10 bg-neutral-700 p-1 rounded-lg hover:bg-zinc-600"/>
                </button>
                <button onClick={()=>{setCallType("videoCall")}}>
                    <img src="/video-call.svg" alt="video" className="h-10 w-10 bg-neutral-700 p-1 rounded-lg hover:bg-zinc-600"/>
                </button>
            </div>
        </div>
        {children}
    </div>
}
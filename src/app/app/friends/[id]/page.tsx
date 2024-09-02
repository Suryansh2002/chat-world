import { fetchMessages } from "@/actions/messages";
import { fetchChannelId } from "@/actions/friends";
import { ShowMessages } from "@/components/chat/show-messages";
import { SendMessage } from "@/components/chat/send-messages";
import { Suspense } from "react";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";

async function Chat({id}:{id:string}) {
    const channelId = (await fetchChannelId({friendId:id}))?.data;
    if (!channelId){
        return <ChatSkeleton/>
    }
    const messages = (await fetchMessages({channelId:channelId}))?.data || [];

    return <div className="flex flex-col h-full w-full bg-neutral-800 rounded-lg p-2 items-center overflow-hidden">
        <ShowMessages messages={messages} channelId={channelId} />
        <SendMessage channelId={channelId} />
    </div>
}

export default async function Page({params:{id}}:{params:{id:string}}){
    return <Suspense fallback={<ChatSkeleton/>}>
        <Chat id={id} />
    </Suspense>
}
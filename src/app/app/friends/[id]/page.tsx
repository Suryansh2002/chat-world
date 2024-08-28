import { fetchMessages } from "@/actions/messages";
import { fetchChannelId } from "@/actions/friends";
import { ShowMessages } from "@/components/chat/show-messages";
import { SendMessage } from "@/components/chat/send-messages";

export default async function Page({params:{id}}:{params:{id:string}}){
    const channelId = (await fetchChannelId({friendId:id}))?.data;
    if (!channelId){
        return <div></div>
    }
    const messages = (await fetchMessages({channelId:channelId}))?.data || [];

    return <div className="flex flex-col h-full w-full bg-neutral-800 rounded-lg p-2 items-center overflow-hidden">
        <ShowMessages messages={messages} channelId={channelId} />
        <SendMessage channelId={channelId} />
    </div>
}
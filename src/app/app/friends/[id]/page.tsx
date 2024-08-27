import { fetchChannelId, fetchMessages } from "@/actions";

export default async function Page({params:{id}}:{params:{id:string}}){
    const channelId = (await fetchChannelId({friendId:id}))?.data;
    if (!channelId){
        return <div></div>
    }
    const messages = (await fetchMessages({channelId:channelId}))?.data || [];
    console.log(messages);
}
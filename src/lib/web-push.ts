import webpush from 'web-push';
import { db } from '@/db';
import "dotenv/config";

webpush.setVapidDetails(
    "https://chatworld.appkite.site",
    process.env.NEXT_PUBLIC_VAPID_KEY!,
    process.env.PRIVATE_VAPID_KEY!
);

export async function sendNotification(userId:string, payload:any){
    const user = await db.query.user.findFirst({
        where: (user, {eq})=>eq(user.id, userId)
    })
    if (!user){
        return;
    }
    if (typeof payload !== "string"){
        payload = JSON.stringify(payload);
    }
    const subscriptions:any[] = JSON.parse(user.subscriptions);

    subscriptions.forEach(sub=>{
        webpush.sendNotification(sub, payload)
    })
}
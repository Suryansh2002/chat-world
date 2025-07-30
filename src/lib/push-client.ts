import { useEffect } from "react";
import { registerPushSubscription } from "@/actions/user";

function isNotificationSupported() {
    return  "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

async function enablePushNotifications() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted"){
        return;
    }
    const registration = await navigator.serviceWorker.register("/service-worker.js");
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
    });
    
    await registerPushSubscription({subscription:JSON.stringify(subscription)});
}

export function usePushClient() {
    useEffect(()=>{
        if (!isNotificationSupported()){
            return;
        }
        enablePushNotifications();
    },[enablePushNotifications])
}
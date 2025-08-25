import { type Session } from "next-auth";
import { IOServer, ServerSocket  } from "../lib/types";
import { calculateDistance } from "@/lib/utils";

const locations: Record<string, { latitude: number; longitude: number }> = {};

export async function handleGlobalMessages(io:IOServer, socket: ServerSocket, session:Session){
    socket.on("sendLocation", async(location: { latitude: number; longitude: number })=>{
      if (!session.dbUser){
        return;
      }
      locations[session.dbUser.id] = location;
    })

    socket.on("disconnect", () => {
      if (!session.dbUser){
        return;
      }
      delete locations[session.dbUser.id];
    })

    socket.on("sendGlobalTypingPing", ()=>{
      if (!session.dbUser){
        return;
      }
      const myloc = locations[session.dbUser.id];
      for (const [id, loc] of Object.entries(locations)){
        const distance = calculateDistance(myloc.latitude, myloc.longitude, loc.latitude, loc.longitude);
        if (distance <= 1 && id!=session.dbUser.id){
            io.to(id).emit("typingPing", session.dbUser.displayName, "global");
        }
      } 
    })
    
    socket.on("sendGlobalMessage", async(message:string)=>{
      if (!session.dbUser){
        return;
      }
      const myloc = locations[session.dbUser.id];
      for (const [id, loc] of Object.entries(locations)){
        const distance = calculateDistance(myloc.latitude, myloc.longitude, loc.latitude, loc.longitude);
        if (distance <= 1){
            io.to(id).emit("message",{
            senderId: session.dbUser.id,
            sender: session.dbUser.displayName,
            message: message,
            imageUrl: session.dbUser.imageUrl,
            channelId: "global"
          })
        }
      }
    })
}
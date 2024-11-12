import { type Session } from "next-auth";
import { IOServer, ServerSocket  } from "../lib/types";
import { db, messages } from "../db";
import { sendNotification } from "../lib/web-push";

export async function handleMessages(io:IOServer, socket: ServerSocket, session:Session){
    socket.on("sendMessage",async(channelId:string, message:string)=>{
      if (!session.dbUser){
        return;
      }
      const friendship = await db.query.friendship.findFirst({
        where: (friendship, {eq})=>eq(friendship.channelId, channelId)
      });
      if (!friendship){
        return;
      }
      if (friendship.sender !== session.dbUser.id && friendship.receiver !== session.dbUser.id){
        return;
      }
      if (friendship.status !== "accepted"){
        return;
      }
      if (message.length === 0 || message.length > 1000){
        return;
      }
      await db.insert(messages).values({
        channelId: channelId,
        sender: session.dbUser.id,
        message: message
      })
  
      for(const userId of [friendship.sender, friendship.receiver]){
        if (io.sockets.adapter.rooms.has(userId)){
          io.to(userId).emit("message",{
            senderId: session.dbUser.id,
            sender: session.dbUser.displayName,
            message: message,
            imageUrl: session.dbUser.imageUrl,
            channelId: channelId
          })
        } else {
          sendNotification(userId, {
            title: "New Message",
            body: `${session.dbUser.displayName} sent you a message`,
          });
        }
      }
    })
  
    socket.on("sendJoinChannel", async(channelId:string)=>{
      if (!session.dbUser){
        return;
      }
      const friendship = await db.query.friendship.findFirst({
        where: (friendship, {eq})=>eq(friendship.channelId, channelId)
      });
      if (!friendship){
        return;
      }
      if (friendship.sender !== session.dbUser.id && friendship.receiver !== session.dbUser.id){
        return;
      }
      if (friendship.status !== "accepted"){
        return;
      }
      socket.join(channelId);
    })
  
    socket.on("sendTypingPing", async(channelId:string)=>{
      if (!session.dbUser){
        return;
      }
      const friendship = await db.query.friendship.findFirst({
        where: (friendship, {eq})=>eq(friendship.channelId, channelId)
      });
      if (!friendship){
        return;
      }
      if (friendship.sender !== session.dbUser.id && friendship.receiver !== session.dbUser.id){
        return;
      }
      socket.to(channelId).emit("typingPing", session.dbUser.displayName, channelId);
    })
  }
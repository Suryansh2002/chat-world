import { type Session } from "next-auth";
import { IOServer, ServerSocket  } from "./lib/types";
import { db, messages } from "./db";


const data:{io?:IOServer} = {};

export async function setSocket(io_:IOServer){
    data.io = io_;
    data.io.on("connection", handleSocket);
}

export async function handleSocket(socket: ServerSocket) {
    const session:Session = await (await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
        headers: {
          cookie: socket.request.headers.cookie || ""
        }
      })).json();
    
    if (!session){
        return;
    }
    if (session.dbUser){
      socket.join(session.dbUser.id);
      handleAuthenticatedSocket(socket, session);
    }
};

async function handleAuthenticatedSocket(socket: ServerSocket, session:Session){
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

    for(let userId of [friendship.sender, friendship.receiver]){
      data.io?.to(userId).emit("message",{
        senderId: session.dbUser.id,
        sender: session.dbUser.displayName,
        message: message,
        imageUrl: session.dbUser.imageUrl,
        channelId: channelId
      })
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
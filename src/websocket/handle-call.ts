import type { Session } from "next-auth";
import type { IOServer, ServerSocket} from "../lib/types";
import { db, friendship } from "../db";
import { or, eq, and } from "drizzle-orm";


export async function handleCallSocket(io:IOServer, socket: ServerSocket, session:Session){
    socket.on("sendOffer", async(offer, userId, callType)=>{
        if (!session.dbUser){
            return;
        }
        session.dbUser.id
        const data = await db.select().from(friendship).where(
            or(
                and(eq(friendship.sender, session.dbUser.id), eq(friendship.receiver, userId)),
                and(eq(friendship.sender, userId), eq(friendship.receiver, session.dbUser.id)
            )
        ));
        if (!data){
            return;
        }
        const friendData = data[0];
        if (!friendData){
            return;
        }
        if (friendData.status !== "accepted"){
            return;
        }
        socket.to(userId).emit("offer", offer, {
            id: session.dbUser.id,
            displayName: session.dbUser.displayName,
            imageUrl: session.dbUser.imageUrl,
            callType: callType
        });
        }
    )

    socket.on("sendAnswer", async(answer, userId)=>{
        if (!session.dbUser){
            return;
        }
        const data = await db.select().from(friendship).where(
            or(
                and(eq(friendship.sender, session.dbUser.id), eq(friendship.receiver, userId)),
                and(eq(friendship.sender, userId), eq(friendship.receiver, session.dbUser.id)
            )
        ));
        if (!data){
            return;
        }
        const friendData = data[0];
        if (!friendData){
            return;
        }
        if (friendData.status !== "accepted"){
            return;
        }
        socket.to(userId).emit("answer", answer, session.dbUser.id);
    })
}
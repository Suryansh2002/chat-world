"use server";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { redirect } from "next/navigation";
import { db, messages, user } from "@/db";
import { asc, eq } from "drizzle-orm";

export const fetchMessages = authActionClient
    .schema(z.object({channelId: z.string()}))
    .action(async({parsedInput:{channelId},ctx:{session}})=>{
        if (!session.dbUser){
            redirect("/signup");
        }
        const friendship = await db.query.friendship.findFirst({
            where: (friendship, {eq})=>eq(friendship.channelId, channelId)
        });
        if (!friendship){
            return [];
        }
        if (friendship.sender !== session.dbUser.id && friendship.receiver !== session.dbUser.id){
            return [];
        }
        return await db.select({
            senderId: messages.sender,
            sender: user.displayName,
            message: messages.message,
            imageUrl: user.imageUrl,
        }).from(messages)
        .where(eq(messages.channelId, channelId))
        .orderBy(asc(messages.createdAt))
        .innerJoin(user, eq(messages.sender, user.id));
    })

export const sendMessage = authActionClient
    .schema(z.object({channelId: z.string(), message: z.string()}))
    .action(async({parsedInput:{channelId, message},ctx:{session}})=>{
        if (!session.dbUser){
            redirect("/signup");
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
        if (message.length === 0){
            return;
        }
        if (message.length > 1000){
            return;
        }

        await db.insert(messages).values({
            channelId: channelId,
            sender: session.dbUser.id,
            message: message
        })
    })
"use server";
import { db, user, friendship } from "@/db";
import { eq, or, and, ne} from "drizzle-orm";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { redirect } from "next/navigation";

export const fetchFriends = authActionClient.action(
    async({ctx:{session}})=>{
        if (!session.dbUser){
            return [];
        }
        const userId = session.dbUser.id;
        return await db.select({id:user.id, displayName: user.displayName, imageUrl:user.imageUrl}).from(friendship).where(
            and(
                or(
                    eq(friendship.sender,userId),
                    eq(friendship.receiver,userId),
                ),
                eq(friendship.status, "accepted")
            )
        ).innerJoin(user, 
            and(
                or(
                    eq(friendship.sender, user.id),
                    eq(friendship.receiver, user.id)
                ),
                ne(user.id, userId)
            )
        )
    }
)

export const fetchIncoming = authActionClient.action(
    async({ctx:{session}})=>{
        if (!session.dbUser){
            return [];
        }
        const userId = session.dbUser.id;
        return await db.select({id:user.id, displayName: user.displayName, imageUrl:user.imageUrl}).from(friendship).where(
            and(
                eq(friendship.receiver,userId),
                eq(friendship.status, "pending")
            )
        ).innerJoin(user, 
            eq(friendship.sender, user.id)
        )
    }
)

export const fetchOutgoing = authActionClient.action(
    async({ctx:{session}})=>{
        if (!session.dbUser){
            return [];
        }
        const userId = session.dbUser.id;
        return await db.select({id:user.id, displayName: user.displayName, imageUrl:user.imageUrl}).from(friendship).where(
            and(
                eq(friendship.sender,userId),
                eq(friendship.status, "pending")
            )
        ).innerJoin(user, 
            eq(friendship.receiver, user.id)
        )
    }
)

export const sendRequest = authActionClient
    .schema(z.object({userName: z.string()}))
    .action(async({parsedInput:{userName}, ctx:{session}})=>{
        if (!session.dbUser){
            redirect("/signup");
        }
        const senderId = session.dbUser.id;
        const reciever = await db.query.user.findFirst({
            where: eq(user.userName, userName)
        })

        if (!reciever){
            throw new Error("User not found !");
        }

        const recieverId = reciever.id;

        const existingRelation = await db.query.friendship.findFirst({
            where: or(
                and(
                    eq(friendship.sender, senderId),
                    eq(friendship.receiver, recieverId)
                ),
                and(
                    eq(friendship.sender, recieverId),
                    eq(friendship.receiver, senderId)
                )
            )
        })
        if (existingRelation?.status === "pending"){
            if (existingRelation.sender === senderId){
                throw new Error("Request already sent !");
            }
            else {
                await db.update(friendship).set(
                    {
                        status: "accepted"
                    }
                ).where(eq(friendship.channelId, existingRelation.channelId))
                return 'Incoming Request accepted !\n Check your Friends List !';
            }
        }
        if (existingRelation?.status === "accepted"){
            throw new Error("Already friends !");
        }
        if (existingRelation?.status === "blocked"){
            throw new Error("You are blocked !");
        }
        if (existingRelation?.status === "none"){
            await db.update(friendship).set(
                {
                    status: "pending",
                    sender: session.dbUser.id,
                    receiver: recieverId
                }
            ).where(eq(friendship.channelId, existingRelation.channelId))
            return 'Request sent !';
        }
        await db.insert(friendship).values({
            sender: senderId,
            receiver: recieverId,
            status: "pending"
        })
        return 'Request sent !';

    })


export const unfriend = authActionClient
    .schema(z.object({id: z.string()}))
    .action(async({parsedInput:{id}, ctx:{session}})=>{
        if (!session.dbUser){
            redirect("/signup");
        }
        const userId = session.dbUser.id;
        const relation = await db.query.friendship.findFirst({
            where: or(
                and(
                    eq(friendship.sender, userId),
                    eq(friendship.receiver, id),
                    eq(friendship.status, "accepted")
                ),
                and(
                    eq(friendship.sender, id),
                    eq(friendship.receiver, userId),
                    eq(friendship.status, "accepted")
                ),
            )
        })
        if (!relation){
            throw new Error("You are not friends with that User !");
        }
        await db.update(friendship).set({"status":"none"}).where(eq(friendship.channelId, relation.channelId));
        return 'Unfriended !';
    })


export const acceptRequest = authActionClient
    .schema(z.object({id: z.string()}))
    .action(async({parsedInput:{id}, ctx:{session}})=>{
        if (!session.dbUser){
            redirect("/signup");
        }
        const userId = session.dbUser.id;
        const relation = await db.query.friendship.findFirst({
            where: and(
                eq(friendship.sender, id),
                eq(friendship.receiver, userId),
                eq(friendship.status, "pending")
            )
        })
        if (!relation){
            throw new Error("No such request !");
        }
        await db.update(friendship).set({"status":"accepted"}).where(eq(friendship.channelId, relation.channelId));
        return 'Accepted !';
    })

export const cancelRequest = authActionClient
    .schema(z.object({id: z.string()}))
    .action(async({parsedInput:{id}, ctx:{session}})=>{
        if (!session.dbUser){
            redirect("/signup");
        }
        const userId = session.dbUser.id;
        const relation = await db.query.friendship.findFirst({
            where: and(
                eq(friendship.sender, userId),
                eq(friendship.receiver, id),
                eq(friendship.status, "pending")
            )
        })
        if (!relation){
            throw new Error("No such request !");
        }
        await db.update(friendship).set({"status":"none"}).where(eq(friendship.channelId, relation.channelId));
        return 'Request Cancelled !';
    })
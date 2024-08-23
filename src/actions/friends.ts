"use server";
import { db, user, friendship } from "@/db";
import { eq, or, and, ne} from "drizzle-orm";
import { authActionClient } from "@/lib/safe-action";

export const fetchFriends = authActionClient.action(
    async({ctx:{session}})=>{
        if (!session.dbUser){
            return [];
        }
        const userId = session.dbUser.id;
        return await db.select({displayName: user.displayName, imageUrl:user.imageUrl}).from(friendship).where(
            and(
                or(
                    eq(friendship.sender,userId),
                    eq(friendship.receiver,userId),
                ),
                ne(user.id, userId)
            )
        ).innerJoin(user, or(
            eq(friendship.sender,user.id),
            eq(friendship.receiver,user.id)
        ))
    }
)
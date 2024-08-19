"use server";
import { db } from "@/db";
import { user, friendship } from "@/db/schema";
import { eq, or, and, ne} from "drizzle-orm";

export async function fetchFriends(userName:string){
    return await db.select({userName: user.userName}).from(friendship).where(
        and(
            or(
                eq(friendship.sender,userName),
                eq(friendship.receiver,userName),
            ),
            ne(user.userName, userName)
        )
    ).innerJoin(user, or(
        eq(friendship.sender,user.userName),
        eq(friendship.receiver,user.userName)
    ))
}
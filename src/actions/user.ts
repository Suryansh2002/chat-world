"use server";
import { authActionClient } from "@/lib/safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { db, user } from "@/db";

const createUserSchema = zfd.formData({
    userName: zfd.text(z.string().min(5).max(20).regex(/^[a-z_]+$/, "Username must contain only lowercase letters and underscores")),
    displayName: zfd.text(z.string().min(5).max(20)),
    gender: zfd.text(z.enum(["male","female","other"])),
});

export const createUser = authActionClient
    .schema(createUserSchema)
    .action(async({parsedInput:{userName,displayName,gender}, ctx:{session}})=>{
        if (session.dbUser){
            redirect("/app/friends");
        }
        if (await db.query.user.findFirst({where:(user,{eq})=>eq(user.userName,userName)})){
            throw new Error("Username already exists");
        }
        if (!session.user?.email){
            throw new Error("Authorization error");
        }
        await db.insert(user).values({
            userName: userName,
            displayName: displayName,
            email: session.user.email,
            gender: gender
        })
        redirect("/");
    });
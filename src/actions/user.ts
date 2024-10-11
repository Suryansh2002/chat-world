"use server";
import { authActionClient } from "@/lib/safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { db, user } from "@/db";
import { eq } from "drizzle-orm";
import {promises as fs} from "fs";
import { fileTypeFromBuffer } from "file-type";
import { ensureUploadsFolder } from "./utils";

const createUserSchema = zfd.formData({
    userName: zfd.text(z.string().min(5).max(20).regex(/^[a-z0-9_]+$/, "Username must contain only lowercase letters,numbers and underscores")),
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

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const UPLOAD_PATH = './uploads';

export const updateUser = authActionClient
    .schema(z.object({
        displayName: z.string().min(5).max(20),
        userName: z.string().min(5).max(20).regex(/^[a-z0-9_]+$/, "Username must contain only lowercase letters,numbers and underscores"),
        file: z.any().optional()
    }))
    .action(async({parsedInput:{displayName,userName,file}, ctx:{session}})=>{
        if (!session.dbUser){
            redirect("/signup")
        }

        let update:{
            displayName:string,
            userName:string,
            imageUrl?:string,
            imageIsSet?:boolean
        } = {
            displayName: displayName,
            userName: userName
        };

        let buffer: Buffer|undefined = undefined;
        if (file){
            buffer = Buffer.from(file);
            let fileUrl = `/uploads/${session.dbUser.id}-profile`
            if (buffer.length > MAX_FILE_SIZE){
                throw new Error("File size must be less than 3MB");
            }
            const fileType = await fileTypeFromBuffer(buffer);
            if (!fileType || !ALLOWED_IMAGE_TYPES.includes(fileType.mime)){
                throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
            } else {
                fileUrl += '.' + fileType.ext;
            }

            try {
                await fs.access(UPLOAD_PATH);
            }
            catch (e){
                await fs.mkdir(UPLOAD_PATH);
            }
            await ensureUploadsFolder(UPLOAD_PATH);
            await fs.writeFile(`.${fileUrl}`,buffer);
            
            update.imageUrl = fileUrl;
            update.imageIsSet = true;
        }

        await db.update(user).set(update).where(eq(user.id,session.dbUser.id));
    });
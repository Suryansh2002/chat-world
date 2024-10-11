import { NextRequest } from "next/server";
import {promises as fs} from "fs"

export async function GET(request:NextRequest){
    const path = `.${request.nextUrl.pathname}`;
    const file = await fs.readFile(path);
    return new Response(file, {
      headers: {
        "Content-Type": `image/${path.split(".").pop()}`
      }
    })
}
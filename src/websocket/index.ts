import { type Session } from "next-auth";
import { IOServer, ServerSocket  } from "../lib/types";
import { handleMessages } from "./messages";

export function setSocket(io:IOServer){
    io.on("connection", socket=>handleSocket(io,socket));
}

export async function handleSocket(io:IOServer, socket: ServerSocket) {
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
      handleMessages(io, socket, session);
    }
};
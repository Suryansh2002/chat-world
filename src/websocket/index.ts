import type { Session } from "next-auth";
import type { IOServer, ServerSocket  } from "../lib/types";
import { handleCallSocket } from "./handle-call";
import { handleMessageSocket } from "./handle-message";

export async function setSocket(io:IOServer){
    io.on("connection", (socket)=>{
      handleSocket(io,socket);
    });
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
      handleAuthenticatedSocket(io, socket, session);
    }
};

async function handleAuthenticatedSocket(io:IOServer, socket: ServerSocket, session:Session){
  handleMessageSocket(io, socket, session);
  handleCallSocket(io, socket, session);
}
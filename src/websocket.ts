import { type Session } from "next-auth";
import { ServerSocket } from "./lib/types";

export async function handleSocket(socket: ServerSocket) {
    const session:Session = await (await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
        headers: {
          cookie: socket.request.headers.cookie || ""
        }
      })).json();
    
    if (!session){
        return;
    }
    handleAuthenticatedSocket(socket, session);
};

async function handleAuthenticatedSocket(socket: ServerSocket, session:Session){

}
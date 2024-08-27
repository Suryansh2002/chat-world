import { type Socket } from "socket.io";

export type Mode = "Friends"|"Incoming"|"Outgoing";
export type ModeList = [Mode, Mode, Mode];
export type FriendType = {id:string, displayName:string, imageUrl:string};


export interface ServerToClientEvents {
    message: (message: {
        senderId: string;
        sender: string;
        message: string;
        imageUrl: string;
    }[]) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export type ServerSocket = Socket<ClientToServerEvents,ServerToClientEvents,InterServerEvents>;
import { type Socket, type Server } from "socket.io";

export type Mode = "Friends"|"Incoming"|"Outgoing";
export type ModeList = [Mode, Mode, Mode];
export type FriendType = {id:string, displayName:string, imageUrl:string};
export type FetchMessage = {senderId:string, sender:string, message:string, imageUrl:string};

export interface ServerToClientEvents {
    message: (message: {
        senderId: string;
        sender: string;
        message: string;
        imageUrl: string;
        channelId: string;
    }) => void;
}

export interface ClientToServerEvents {
    sendMessage: (channelId: string, message: string) => void;
}

export interface InterServerEvents {}

export type ServerSocket = Socket<ClientToServerEvents,ServerToClientEvents,InterServerEvents>;
export type IOServer = Server<ClientToServerEvents,ServerToClientEvents,InterServerEvents>
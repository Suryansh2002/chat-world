import { type Socket, type Server } from "socket.io";

export type Mode = "Friends"|"Incoming"|"Outgoing";
export type ModeList = [Mode, Mode, Mode];
export type FriendType = {id:string, displayName:string, imageUrl:string};
export type FetchMessage = {senderId:string, sender:string, message:string, imageUrl:string};

type callType = "call"|"videoCall"
export type RTCUser = {id:string, displayName:string, imageUrl:string, callType:callType};

export interface ServerToClientEvents {
    message: (message: {
        senderId: string;
        sender: string;
        message: string;
        imageUrl: string;
        channelId: string;
    }) => void;
    typingPing: (who: string, channelId:string) => void;
    offer: (offer: RTCSessionDescriptionInit, user:RTCUser) => void;
    answer: (answer: RTCSessionDescriptionInit, userId:string) => void;
}

export interface ClientToServerEvents {
    sendMessage: (channelId: string, message: string) => void;
    sendTypingPing: (channelId: string) => void;
    sendJoinChannel: (channelId: string) => void;
    sendOffer: (offer: RTCSessionDescriptionInit, userId:string, callType:callType) => void;
    sendAnswer: (answer: RTCSessionDescriptionInit, userId:string) => void;
}

export interface InterServerEvents {}

export type ServerSocket = Socket<ClientToServerEvents,ServerToClientEvents,InterServerEvents>;
export type IOServer = Server<ClientToServerEvents,ServerToClientEvents,InterServerEvents>
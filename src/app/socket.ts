"use client";

import { io, Socket, } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@/lib/types";

export const socket:Socket<ServerToClientEvents,ClientToServerEvents> = io();
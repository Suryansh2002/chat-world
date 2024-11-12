"use client";
import type { FetchMessage } from "@/lib/types";
import { socket } from "@/app/socket";
import { useState, useEffect, useCallback, useRef } from "react";

export function useTypingWho(channelId: string): string | null | undefined {
    const [typingWho, setTypingWho] = useState<string | null>();
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const handleTypingPing = useCallback((who: string, socketChannelId: string) => {
        if (channelId === socketChannelId) {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            setTypingWho(who);
            timeout.current = setTimeout(() => {
                setTypingWho(null);
            }, 3000);
        }
    }, [channelId]);

    useEffect(() => {
        socket.emit("sendJoinChannel", channelId);
        socket.on("typingPing", handleTypingPing);
        return () => {
            socket.off("typingPing", handleTypingPing);
        };
    }, [channelId, handleTypingPing]);

    return typingWho;
}

export function useStateFulMessages(initialMessages: FetchMessage[], channelId: string): FetchMessage[] {
    const [stateFulMessages, setMessages] = useState(initialMessages);

    const handleNewMessage = useCallback((message: FetchMessage & { channelId: string }) => {
        if (message.channelId === channelId) {
            setMessages(prev => [...prev, message]);
        }
    }, [channelId]);

    useEffect(() => {
        socket.on("message", handleNewMessage);
        return () => {
            socket.off("message", handleNewMessage);
        };
    }, [channelId, handleNewMessage]);

    return stateFulMessages;
}
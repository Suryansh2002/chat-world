import { createContext, useContext, useRef } from "react";
import type { MutableRefObject } from "react";

export const RTCConnectionContext = createContext<MutableRefObject<RTCPeerConnection|null>>({current:null});

export function useRTC(){
    return useContext(RTCConnectionContext);
}
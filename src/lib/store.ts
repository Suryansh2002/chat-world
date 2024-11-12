import { create } from 'zustand';
import { FriendType } from './types';

interface FriendsStore {
    userRelations: {
        Friends: FriendType[],
        Incoming: FriendType[],
        Outgoing: FriendType[]
    },
    setUserRelations: (newState:{
        Friends?: FriendType[],
        Incoming?: FriendType[],
        Outgoing?: FriendType[]
    }) => void
}

interface CallStore {
    callType: "call"|"videoCall"|null,
    setCallType: (callType:"call"|"videoCall"|null)=>void
}

export const friendsStore = create<FriendsStore>((set)=>({
    userRelations: {
        Friends: [], 
        Incoming: [],
        Outgoing: [],
    },
    setUserRelations: (newState) =>
        set((state) => ({
          userRelations: { ...state.userRelations, ...newState },
        })),
}))

export const callStore = create<CallStore>((set)=>({
    callType:null,
    setCallType:(callType)=>{
        set({callType})
    }
}))
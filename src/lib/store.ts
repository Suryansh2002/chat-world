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
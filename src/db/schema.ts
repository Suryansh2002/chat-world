import { pgTable, uuid, text, boolean, pgEnum, index, timestamp, time} from "drizzle-orm/pg-core";


export const friendshipStatus = pgEnum("friendshipStatus",["pending","accepted","blocked","none"])
export const genderEnum = pgEnum("gender",["male","female","other"])

export const user = pgTable("user",{
    id: uuid("id").defaultRandom().primaryKey(),
    displayName: text("displayName").notNull(),
    userName: text("userName").notNull().unique(),
    email: text("email").notNull(),
    gender: genderEnum("gender").notNull(),
    imageUrl : text("imageUrl").notNull().default(""),
    imageIsSet: boolean("imageIsSet").notNull().default(false),
})

export const friendship = pgTable("friendship",{
    channelId: uuid("channelId").defaultRandom().primaryKey(),
    sender: uuid("sender").notNull().references(()=>user.id),
    receiver: uuid("receiver").notNull().references(()=>user.id),
    status: friendshipStatus("status").notNull().default("pending"),
}, (table)=>{
    return {
        senderIndex: index("senderIndex").on(table.sender, table.status),
        receiverIndex: index("receiverIndex").on(table.receiver, table.status),
    }
})

export const messages = pgTable("messages",{
    id: uuid("id").defaultRandom().primaryKey(),
    channelId: uuid("channelId").notNull(),
    sender: uuid("sender").notNull().references(()=>user.id),
    message: text("message").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
} , (table)=>{
    return {
        channelIdIndex: index("channelIdIndex").on(table.channelId, table.createdAt),
    }
})


export type User = typeof user.$inferSelect;
export type Friendship = typeof friendship.$inferSelect;
export type Messages = typeof messages.$inferSelect;

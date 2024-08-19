import { pgTable, uuid, text, boolean, pgEnum, index} from "drizzle-orm/pg-core";


export const friendshipStatus = pgEnum("friendshipStatus",["pending","accepted","blocked"])
export const genderEnum = pgEnum("gender",["male","female","other"])

export const user = pgTable("user",{
    id: uuid("id").defaultRandom().primaryKey(),
    displayName: text("displayName").notNull(),
    userName: text("userName").notNull().unique(),
    email: text("email").notNull(),
    gender: genderEnum("gender").notNull(),
    imageUrl : text("imageUrl"),
    imageIsSet: boolean("imageIsSet").notNull().default(false),
})

export const friendship = pgTable("friendship",{
    sender: text("sender").notNull().references(()=>user.userName),
    receiver: text("receiver").notNull().references(()=>user.userName),
    status: friendshipStatus("status").notNull().default("pending"),
}, (table)=>{
    return {
        senderIndex: index("senderIndex").on(table.sender),
        receiverIndex: index("receiverIndex").on(table.receiver),
    }
})

export type User = typeof user.$inferSelect;
export type Friendship = typeof friendship.$inferSelect;

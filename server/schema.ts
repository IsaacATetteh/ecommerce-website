import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    pgEnum
  } from "drizzle-orm/pg-core"
  
  import postgres from "postgres"
  import { drizzle } from "drizzle-orm/postgres-js"
  import type { AdapterAccount} from "next-auth/adapters"
  import {createId} from "@paralleldrive/cuid2"
   
  const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle"
  const pool = postgres(connectionString, { max: 1 })
   
  export const db = drizzle(pool)
  export const RoleEnum = pgEnum("roles", ["user", "admin"])
   
  export const users = pgTable("user", {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    username: text("username"),
    email: text("email").unique(),
    password: text("password"),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    twoFactorEnalbed : boolean("twoFactorEnabled").default(false),
    role : RoleEnum("roles").default("user")
  })
   
  export const accounts = pgTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccount>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    },
    (account) => ({
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    })
  )
   
  export const verificationTokens = pgTable(
    "verificationToken",
    {
      id: text("id").notNull().$defaultFn(() => createId()),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
      email: text("email").notNull(),
    },
    (verificationToken) => ({
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    })
  )
   
 
   

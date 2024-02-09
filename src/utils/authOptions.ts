import { AuthOptions, Session } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


type User = {
    id: string,
    name: string,
    password: string,
    email: string
}

export const authOptions: AuthOptions = {
    providers: [
        Credentials({

            name: "Credentials",

            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const user: User = await prisma.users.findUnique({
                    where: {
                        email: credentials?.username
                    }
                })
                if (user) {
                    return user;
                }

                // const user: User[] = await db.query("SELECT * FROM users WHERE email = ?", [credentials?.username])
                // if (user[0].password == credentials?.password) {
                //     return user[0]
                // }
                return null
            },
        }),
    ],
    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    }
}
import axios from "axios";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: "identify" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }: any) {
      const username = user.name;
      if (account.provider === "discord") {
        try {
          await axios.post(`${process.env.BASE_URL}api/createUser`, {
            username,
          });
          return user;
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
};

export default NextAuth(authOptions);

import NextAuth, { type NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { MiddlewareConfig } from "next/server";
import { getUserByEmail } from "./scripts/db";

// eslint-disable-next-line new-cap
const nextAuthResult = NextAuth({
	callbacks: {
		authorized: ({ auth, request: { nextUrl } }) => {
			if (nextUrl.pathname.startsWith("/dashboard")) {
				return Boolean(auth?.user);
			}

			return true;
		}
	},
	pages: {
		signIn: "/login"
	},
	providers: [
		// eslint-disable-next-line new-cap
		Credentials({
			authorize: async (credentials) => {
				const { email } = credentials;
				if (typeof email !== "string") {
					return null;
				}

				return (await getUserByEmail(email)) ?? null;
			}
		})
	]
});

export const { signIn, signOut } = nextAuthResult;

// TypeScript is being very odd about this type, so this strict typing is necessary.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export default nextAuthResult.auth as NextAuthResult["auth"];

export const config: MiddlewareConfig = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"]
};

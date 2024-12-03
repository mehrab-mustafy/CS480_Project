import type { NextConfig } from "next";

export default {
	pageExtensions: ["ts", "tsx"],
	sassOptions: { silenceDeprecations: ["legacy-js-api"] } // See vercel/next.js#71638
} as NextConfig;

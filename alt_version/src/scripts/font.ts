// eslint-disable-next-line camelcase
import { Ubuntu_Sans } from "next/font/google";

// eslint-disable-next-line new-cap
const font = Ubuntu_Sans({
	adjustFontFallback: false,
	subsets: ["latin"],
	variable: "--font"
});

export default font;

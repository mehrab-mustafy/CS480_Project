import "../styles/global.scss";
import type { Metadata, Viewport } from "next";
import type LayoutProps from "../scripts/LayoutProps";
import Topnav from "../components/Topnav/Topnav";
import domain from "../scripts/domain";
import font from "../scripts/font";
import style from "./layout.module.scss";

export default function Layout({ children }: LayoutProps) {
	return (
		<html lang="en-US" className={font.variable}>
			<body className={style["spacer"]}>
				<header>
					<Topnav />
				</header>
				<main>{children}</main>
				<footer></footer>
			</body>
		</html>
	);
}

export const viewport: Viewport = {
	colorScheme: "light",
	themeColor: "#50c878"
};

export const metadata: Metadata = {
	authors: [{ name: "Travis Martin", url: "https://www.lakuna.pw" }],
	creator: "Travis Martin",
	metadataBase: new URL(domain),
	openGraph: {
		siteName: "EC Shop",
		type: "website"
	},
	publisher: "Travis Martin",
	title: {
		default: "Page",
		template: "%s | EC Shop"
	},
	twitter: {
		creatorId: "1117270419298496513",
		siteId: "1117270419298496513"
	}
};

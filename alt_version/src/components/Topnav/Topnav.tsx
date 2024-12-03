import type { JSX } from "react";
import Link from "../Link";
import style from "./topnav.module.scss";

export default function Topnav({
	className,
	...props
}: JSX.IntrinsicElements["nav"]) {
	const topnavClassName = style["topnav"];

	const fullClassName = topnavClassName
		? className
			? `${topnavClassName} ${className}`
			: topnavClassName
		: className;

	return (
		<nav className={fullClassName} {...props}>
			<ul>
				<li>
					<Link href="/">{"Index"}</Link>
				</li>
				<li>
					<Link href="/products">{"Products"}</Link>
				</li>
				<li>
					<Link href="/vendors">{"Vendors"}</Link>
				</li>
				<li>
					<Link href="/dashboard">{"Dashboard"}</Link>
				</li>
			</ul>
		</nav>
	);
}

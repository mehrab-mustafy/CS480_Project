"use client";

import Link from "../../components/Link";
import { signUp } from "../../scripts/actions";
import { useActionState } from "react";

export default function Page() {
	const [state, formAction, isPending] = useActionState(signUp, void 0);

	return (
		<>
			<h1>Sign Up</h1>
			<hr />
			<form action={formAction}>
				<label htmlFor="name">{"Name: "}</label>
				<input
					type="text"
					id="name"
					name="name"
					placeholder="John Doe"
					required
				/>
				<br />
				<label htmlFor="email">{"Email address: "}</label>
				<input
					type="email"
					id="email"
					name="email"
					placeholder="john.doe@example.com"
					required
				/>
				<br />
				<label htmlFor="phone">{"Phone number: "}</label>
				<input
					type="text"
					id="phone"
					name="phone"
					placeholder="+1 (234) 567-8901"
					required
				/>
				<br />
				<input type="submit" value="Sign Up" disabled={isPending} />
			</form>
			{state && <p>{state}</p>}
			<hr />
			<p>
				<Link href="/login">Log In</Link>
			</p>
		</>
	);
}

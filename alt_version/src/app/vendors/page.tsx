import Card from "../../components/Card/Card";
import CardList from "../../components/CardList/CardList";
import type { Metadata } from "next";
import { getAllVendors } from "../../scripts/db";

export default async function Page() {
	return (
		<>
			<h1>{"Vendors"}</h1>
			<hr />
			<CardList>
				{(await getAllVendors()).map((vendor) => (
					<Card key={vendor.user_id} href={`/vendors/${vendor.user_id}`}>
						<h2>{vendor.name}</h2>
						<hr />
						<p>
							<strong>Email address:</strong> {vendor.email}
						</p>
						<p>
							<strong>Phone number:</strong> {vendor.phone}
						</p>
					</Card>
				))}
			</CardList>
		</>
	);
}

export const metadata: Metadata = {
	description: "A list of vendors.",
	openGraph: { url: "/vendors" },
	title: "Vendors"
};

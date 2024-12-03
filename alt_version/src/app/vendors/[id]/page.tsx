import { getProductsWithVendorId, getUserById } from "../../../scripts/db";
import Card from "../../../components/Card/Card";
import CardList from "../../../components/CardList/CardList";
import type { Metadata } from "next";
import formatPrice from "../../../scripts/formatPrice";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	const vendor = await getUserById(id);
	if (!vendor) {
		return <h1>{"Unknown Vendor"}</h1>;
	}

	const products = await getProductsWithVendorId(id);

	return (
		<>
			<h1>{vendor.name}</h1>
			<p>
				<strong>Email address:</strong> {vendor.email}
			</p>
			<p>
				<strong>Phone number:</strong> {vendor.phone}
			</p>
			<p>
				<strong>ID:</strong> {vendor.user_id}
			</p>
			<h2>{"Products"}</h2>
			<hr />
			<CardList>
				{products.map((product) => (
					<Card
						key={product.product_id}
						href={`/products/${product.product_id}`}
					>
						<h2>{product.name}</h2>
						<p>{product.description}</p>
						<hr />
						<p>
							<strong>Price:</strong> {formatPrice(product.price)}
						</p>
						<p>
							<strong>Stock quantity:</strong> {product.stock_quantity}
						</p>
					</Card>
				))}
			</CardList>
		</>
	);
}

export const generateMetadata = async ({
	params
}: Props): Promise<Metadata> => {
	const { id } = await params;
	const vendor = await getUserById(id);
	return {
		description: "A vendor.",
		openGraph: { url: `/vendors/${id}` },
		title: vendor ? vendor.name : "Unknown Vendor"
	};
};

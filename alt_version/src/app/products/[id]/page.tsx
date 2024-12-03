import {
	getOrdersWithProductId,
	getProductById,
	getUserByEmail,
	getUserById
} from "../../../scripts/db";
import Link from "../../../components/Link";
import type { Metadata } from "next";
import auth from "../../../middleware";
import { createOrderFromForm } from "../../../scripts/actions";
import formatPrice from "../../../scripts/formatPrice";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	const product = await getProductById(id);
	if (!product) {
		return <h1>{"Unknown Product"}</h1>;
	}

	const vendor = await getUserById(product.user_id);

	const orders = await getOrdersWithProductId(id);

	const session = await auth();
	const user =
		session?.user?.email && (await getUserByEmail(session.user.email));

	return (
		<>
			<h1>{product.name}</h1>
			<p>
				<strong>Description:</strong> {product.description}
			</p>
			<p>
				<strong>Price:</strong> {formatPrice(product.price)}
			</p>
			<p>
				<strong>Stock quantity:</strong> {product.stock_quantity}
			</p>
			{vendor && (
				<p>
					<strong>Vendor:</strong>{" "}
					<Link href={`/vendors/${vendor.user_id}`}>{vendor.name}</Link>
				</p>
			)}
			<p>
				<strong>ID:</strong> {product.product_id}
			</p>
			<h2>{"Orders"}</h2>
			<hr />
			{orders.map((order) => (
				<div key={order.order_id}>
					<h3>
						{"Order "}
						{order.order_id}
					</h3>
					<p>
						<strong>{"Order date: "}</strong> {order.order_date.toISOString()}
					</p>
					<p>
						<strong>{"Estimated delivery date: "}</strong>{" "}
						{order.estimated_delivery_date.toISOString()}
					</p>
					<p>
						<strong>{"Delivery date: "}</strong>{" "}
						{order.actual_delivery_date?.toISOString() ?? "Not delivered."}
					</p>
					<p>
						<strong>{"Status: "}</strong> {order.status}
					</p>
					<p>
						<strong>{"Orderer ID: "}</strong> {order.user_id}
					</p>
					<p>
						<strong>{"Payment information ID: "}</strong>{" "}
						{order.payment_info_id}
					</p>
				</div>
			))}
			{user && (
				<>
					<h3>{"Place New Order"}</h3>
					<form
						action={async (formData: FormData) => {
							"use server";
							await createOrderFromForm(void 0, formData);
						}}
					>
						<label htmlFor="payment_info_id">
							{"Payment information ID: "}
						</label>
						<input
							type="text"
							id="payment_info_id"
							name="payment_info_id"
							required
						/>
						<br />
						<label htmlFor="address_id">{"Address ID: "}</label>
						<input type="text" id="address_id" name="address_id" required />
						<br />
						<label htmlFor="quantity">{"Quantity: "}</label>
						<input type="number" id="quantity" name="quantity" required />
						<br />
						<input
							type="hidden"
							id="user_id"
							name="user_id"
							value={user.user_id}
						/>
						<input type="hidden" id="product_id" name="product_id" value={id} />
						<input type="submit" value="Create Order" />
					</form>
				</>
			)}
		</>
	);
}

export const generateMetadata = async ({
	params
}: Props): Promise<Metadata> => {
	const { id } = await params;
	const product = await getProductById(id);
	return {
		description: "A product.",
		openGraph: { url: `/products/${id}` },
		title: product ? product.name : "Unknown Product"
	};
};

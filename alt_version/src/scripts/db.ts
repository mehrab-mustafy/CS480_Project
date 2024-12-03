import type { Address } from "../types/Address";
import type { Order } from "../types/Order";
import type { OrderItem } from "../types/OrderItem";
import type { PaymentInfo } from "../types/PaymentInfo";
import type { Product } from "../types/Product";
import type { User } from "../types/User";
import { sql } from "@vercel/postgres";

export const getAllProducts = async () =>
	(await sql<Product>`SELECT * FROM Products`).rows;

export const getProductById = async (id: string) =>
	(await sql<Product>`SELECT * FROM Products WHERE product_id = ${id}`).rows[0];

export const getProductsWithVendorId = async (id: string) =>
	(await sql<Product>`SELECT * FROM Products WHERE user_id = ${id}`).rows;

export const getUserByEmail = async (email: string) =>
	(await sql<User>`SELECT * FROM Users WHERE email = ${email}`).rows[0];

export const getUserById = async (id: string) =>
	(await sql<User>`SELECT * FROM Users WHERE user_id = ${id}`).rows[0];

export const getAllVendors = async () =>
	(
		await sql<User>`SELECT Users.* FROM Users INNER JOIN Products USING (user_id)`
	).rows;

export const createUser = async (user: User) => sql`
	INSERT INTO Users (email, name, phone)
	VALUES (${user.email}, ${user.name}, ${user.phone})
	ON CONFLICT (user_id) DO NOTHING;
`;

export const createAddress = async (address: Address) => sql`
	INSERT INTO Addresses (user_id, is_shipping, street_address, city, state, postal_code, country)
	VALUES (${address.user_id}, ${address.is_shipping}, ${address.street_address}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country})
	ON CONFLICT (address_id) DO NOTHING;
`;

export const getAddressesByUserId = async (id: string) =>
	(await sql<Address>`SELECT * FROM Addresses WHERE user_id = ${id}`).rows;

export const createPaymentInfo = async (paymentInfo: PaymentInfo) => sql`
	INSERT INTO PaymentInfos (user_id, method, card_number, card_holder_name, expiration_date, address_id)
	VALUES (${paymentInfo.user_id}, ${paymentInfo.method}, ${paymentInfo.card_number}, ${paymentInfo.card_holder_name}, ${paymentInfo.expiration_date.toISOString().slice(0, 10)}, ${paymentInfo.address_id})
	ON CONFLICT (payment_info_id) DO NOTHING;
`;

export const getPaymentInfosByUserId = async (id: string) =>
	(await sql<PaymentInfo>`SELECT * FROM PaymentInfos WHERE user_id = ${id}`)
		.rows;

export const getOrdersWithProductId = async (id: string) =>
	(
		await sql<Order>`SELECT Orders.* FROM Orders INNER JOIN OrderItems USING (order_id) INNER JOIN Products USING (product_id) WHERE product_id = ${id}`
	).rows;

export const createOrder = async (order: Order) =>
	(
		await sql<Order>`
	INSERT INTO Orders (order_date, status, estimated_delivery_date, user_id, payment_info_id, address_id)
	VALUES (${order.order_date.toISOString().slice(0, 10)}, ${order.status}, ${order.estimated_delivery_date.toISOString().slice(0, 10)}, ${order.user_id}, ${order.payment_info_id}, ${order.address_id})
	ON CONFLICT (order_id) DO NOTHING;
`
	).rows[0];

export const createOrderItem = async (orderItem: OrderItem) => sql`
	INSERT INTO OrderItems (order_id, product_id, quantity)
	VALUES (${orderItem.order_id}, ${orderItem.product_id}, ${orderItem.quantity})
	ON CONFLICT (order_item_id) DO NOTHING;
`;

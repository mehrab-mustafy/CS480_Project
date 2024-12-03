import type { Address } from "../types/Address";
import type { Category } from "../types/Category";
import type { Order } from "../types/Order";
import type { OrderItem } from "../types/OrderItem";
import type { PaymentInfo } from "../types/PaymentInfo";
import type { Product } from "../types/Product";
import type { ProductCategory } from "../types/ProductCategory";
import type { Review } from "../types/Review";
import type { User } from "../types/User";

export const users: User[] = [
	{
		email: "john.doe@example.com",
		name: "John Doe",
		phone: "+1 (817) 123-4567",
		// eslint-disable-next-line camelcase
		user_id: "7e944cf9-b0c4-41e4-a88f-cab24fe249e1"
	},
	{
		email: "jane.doe@example.com",
		name: "Jane Doe",
		phone: "+1 (412) 765-4321",
		// eslint-disable-next-line camelcase
		user_id: "a3cecf66-5582-4fc3-868f-69662fa8d94e"
	},
	{
		email: "contact@acme.com",
		name: "Acme",
		phone: "+1 (100) 100-1000",
		// eslint-disable-next-line camelcase
		user_id: "07181f65-e175-44b7-a6dc-2e29c8b33239"
	}
];

export const addresses: Address[] = [
	{
		// eslint-disable-next-line camelcase
		address_id: "d33eb67b-4c6e-456f-981d-7d4349aae7ae",
		city: "Chicago",
		country: "United States",
		// eslint-disable-next-line camelcase
		is_shipping: true,
		// eslint-disable-next-line camelcase
		postal_code: "60607",
		state: "Illinois",
		// eslint-disable-next-line camelcase
		street_address: "100 West Taylor Street",
		// eslint-disable-next-line camelcase
		user_id: "7e944cf9-b0c4-41e4-a88f-cab24fe249e1" // John Doe.
	},
	{
		// eslint-disable-next-line camelcase
		address_id: "6f438e2c-eb93-4bda-a72a-f3d2c674a3ee",
		city: "Fort Worth",
		country: "United States",
		// eslint-disable-next-line camelcase
		is_shipping: true,
		// eslint-disable-next-line camelcase
		postal_code: "76244",
		state: "Texas",
		// eslint-disable-next-line camelcase
		street_address: "9999 Brewster Lane",
		// eslint-disable-next-line camelcase
		user_id: "a3cecf66-5582-4fc3-868f-69662fa8d94e" // Jane Doe.
	},
	{
		// eslint-disable-next-line camelcase
		address_id: "8bdfdeb7-8962-45f9-b024-e7fa909672cd",
		city: "New York",
		country: "United States",
		// eslint-disable-next-line camelcase
		is_shipping: true,
		// eslint-disable-next-line camelcase
		postal_code: "10001",
		state: "New York",
		// eslint-disable-next-line camelcase
		street_address: "1 First Street",
		// eslint-disable-next-line camelcase
		user_id: "7e944cf9-b0c4-41e4-a88f-cab24fe249e1" // Acme.
	}
];

export const paymentInfos: PaymentInfo[] = [
	{
		// eslint-disable-next-line camelcase
		address_id: "d33eb67b-4c6e-456f-981d-7d4349aae7ae", // John Doe's shipping address.
		// eslint-disable-next-line camelcase
		card_holder_name: "John Doe",
		// eslint-disable-next-line camelcase
		card_number: "0123 4567 8901 2345",
		// eslint-disable-next-line camelcase
		expiration_date: new Date("01-01-2026"),
		method: "credit card",
		// eslint-disable-next-line camelcase
		payment_info_id: "1e6be728-7ad5-49dc-8940-270e1d4e5e0f",
		// eslint-disable-next-line camelcase
		user_id: "7e944cf9-b0c4-41e4-a88f-cab24fe249e1" // John Doe.
	},
	{
		// eslint-disable-next-line camelcase
		address_id: "6f438e2c-eb93-4bda-a72a-f3d2c674a3ee", // Jane Doe's shipping address.
		// eslint-disable-next-line camelcase
		card_holder_name: "Jane Doe",
		// eslint-disable-next-line camelcase
		card_number: "0987 6543 2109 8765",
		// eslint-disable-next-line camelcase
		expiration_date: new Date("01-01-2026"),
		method: "credit card",
		// eslint-disable-next-line camelcase
		payment_info_id: "4452019b-d05a-4ac9-b846-dde2619cea5a",
		// eslint-disable-next-line camelcase
		user_id: "a3cecf66-5582-4fc3-868f-69662fa8d94e" // Jane Doe.
	}
];

export const orders: Order[] = [
	{
		// eslint-disable-next-line camelcase
		actual_delivery_date: new Date("03-21-2021"),
		// eslint-disable-next-line camelcase
		address_id: "d33eb67b-4c6e-456f-981d-7d4349aae7ae", // John Doe's shipping address.
		// eslint-disable-next-line camelcase
		estimated_delivery_date: new Date("03-21-2021"),
		// eslint-disable-next-line camelcase
		order_date: new Date("03-13-2021"),
		// eslint-disable-next-line camelcase
		order_id: "5aff04d2-31a7-4836-98e6-bec8b3513cd5",
		// eslint-disable-next-line camelcase
		payment_info_id: "1e6be728-7ad5-49dc-8940-270e1d4e5e0f", // John Doe's payment information.
		status: "delivered",
		// eslint-disable-next-line camelcase
		user_id: "7e944cf9-b0c4-41e4-a88f-cab24fe249e1" // John Doe.
	},
	{
		// eslint-disable-next-line camelcase
		actual_delivery_date: new Date("03-21-2021"),
		// eslint-disable-next-line camelcase
		address_id: "6f438e2c-eb93-4bda-a72a-f3d2c674a3ee", // Jane Doe's shipping address.
		// eslint-disable-next-line camelcase
		estimated_delivery_date: new Date("03-21-2021"),
		// eslint-disable-next-line camelcase
		order_date: new Date("03-13-2021"),
		// eslint-disable-next-line camelcase
		order_id: "f89648e3-8d90-4ea5-b0d4-1c64bb1492e3",
		// eslint-disable-next-line camelcase
		payment_info_id: "4452019b-d05a-4ac9-b846-dde2619cea5a", // Jane Doe's payment information.
		status: "delivered",
		// eslint-disable-next-line camelcase
		user_id: "a3cecf66-5582-4fc3-868f-69662fa8d94e" // Jane Doe.
	}
];

export const products: Product[] = [
	{
		description: "A small rectangular block of fired clay.",
		name: "Brick",
		price: 10,
		// eslint-disable-next-line camelcase
		product_id: "3b2f299e-0489-43f9-902d-278d3b627059",
		// eslint-disable-next-line camelcase
		stock_quantity: 9999,
		// eslint-disable-next-line camelcase
		user_id: "07181f65-e175-44b7-a6dc-2e29c8b33239" // Acme.
	}
];

export const orderItems: OrderItem[] = [
	{
		// eslint-disable-next-line camelcase
		order_id: "5aff04d2-31a7-4836-98e6-bec8b3513cd5", // John Doe's order.
		// eslint-disable-next-line camelcase
		order_item_id: "d154c1d2-8cff-42dd-8e86-c7df638445f8",
		// eslint-disable-next-line camelcase
		product_id: "3b2f299e-0489-43f9-902d-278d3b627059", // Brick.
		quantity: 1
	},
	{
		// eslint-disable-next-line camelcase
		order_id: "f89648e3-8d90-4ea5-b0d4-1c64bb1492e3", // Jane Doe's order.
		// eslint-disable-next-line camelcase
		order_item_id: "381565c9-9d6b-4c08-8439-ad05ed783346",
		// eslint-disable-next-line camelcase
		product_id: "3b2f299e-0489-43f9-902d-278d3b627059", // Brick.
		quantity: 10
	}
];

export const categories: Category[] = [
	{
		// eslint-disable-next-line camelcase
		category_id: "03ae881c-a0c3-48d6-b441-1c913acf0352",
		description: "Materials for building structures.",
		name: "Building Materials"
	}
];

export const productCategories: ProductCategory[] = [
	{
		// eslint-disable-next-line camelcase
		category_id: "03ae881c-a0c3-48d6-b441-1c913acf0352", // Building materials.
		// eslint-disable-next-line camelcase
		product_category_id: "c637c633-3040-4865-913a-38d60c05964a",
		// eslint-disable-next-line camelcase
		product_id: "3b2f299e-0489-43f9-902d-278d3b627059" // Brick.
	}
];

export const reviews: Review[] = [
	{
		comment: "Explodes randomly.",
		// eslint-disable-next-line camelcase
		date_submitted: new Date("03-22-2021"),
		rating: 1,
		// eslint-disable-next-line camelcase
		review_id: "bd302c97-9394-4f7a-9378-bcba0c916de5",
		// eslint-disable-next-line camelcase
		user_id: "7e944cf9-b0c4-41e4-a88f-cab24fe249e1" // John Doe.
	}
];

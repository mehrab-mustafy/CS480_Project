import {
	addresses,
	categories,
	orderItems,
	orders,
	paymentInfos,
	productCategories,
	products,
	reviews,
	users
} from "../../scripts/seedData";
import { sql } from "@vercel/postgres";

const seedUsers = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await sql`
		CREATE TABLE IF NOT EXISTS Users (
			user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			email TEXT NOT NULL UNIQUE,
			name TEXT NOT NULL,
			phone TEXT NOT NULL UNIQUE
		);
	`;
	return await Promise.all(
		users.map(async (user) => {
			return sql`
				INSERT INTO Users (user_id, email, name, phone)
				VALUES (${user.user_id}, ${user.email}, ${user.name}, ${user.phone})
				ON CONFLICT (user_id) DO NOTHING;
			`;
		})
	);
};

const seedAddresses = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await sql`
		CREATE TABLE IF NOT EXISTS Addresses (
			address_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			user_id UUID NOT NULL REFERENCES Users,
			is_shipping BOOLEAN NOT NULL,
			street_address TEXT NOT NULL,
			city TEXT NOT NULL,
			state TEXT NOT NULL,
			postal_code TEXT NOT NULL,
			country TEXT NOT NULL
		);
	`;
	return await Promise.all(
		addresses.map(async (address) => {
			return sql`
				INSERT INTO Addresses (address_id, user_id, is_shipping, street_address, city, state, postal_code, country)
				VALUES (${address.address_id}, ${address.user_id}, ${address.is_shipping}, ${address.street_address}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country})
				ON CONFLICT (address_id) DO NOTHING;
			`;
		})
	);
};

const seedPaymentInfos = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await sql`
		CREATE TABLE IF NOT EXISTS PaymentInfos (
			payment_info_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			user_id UUID NOT NULL REFERENCES Users,
			method TEXT NOT NULL,
			card_number TEXT NOT NULL,
			card_holder_name TEXT NOT NULL,
			expiration_date DATE NOT NULL,
			address_id UUID NOT NULL REFERENCES Addresses
		);
	`;
	return await Promise.all(
		paymentInfos.map(async (paymentInfo) => {
			return sql`
				INSERT INTO PaymentInfos (payment_info_id, user_id, method, card_number, card_holder_name, expiration_date, address_id)
				VALUES (${paymentInfo.payment_info_id}, ${paymentInfo.user_id}, ${paymentInfo.method}, ${paymentInfo.card_number}, ${paymentInfo.card_holder_name}, ${paymentInfo.expiration_date.toISOString().slice(0, 10)}, ${paymentInfo.address_id})
				ON CONFLICT (payment_info_id) DO NOTHING;
			`;
		})
	);
};

const seedOrders = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await sql`
		CREATE TABLE IF NOT EXISTS Orders (
			order_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			order_date DATE NOT NULL,
			status TEXT NOT NULL,
			estimated_delivery_date DATE NOT NULL,
			user_id UUID NOT NULL REFERENCES Users,
			payment_info_id UUID NOT NULL REFERENCES PaymentInfos,
			address_id UUID NOT NULL REFERENCES Addresses,
			actual_delivery_date DATE
		);
	`;
	return await Promise.all(
		orders.map(async (order) => {
			return sql`
				INSERT INTO Orders (order_id, order_date, status, estimated_delivery_date, user_id, payment_info_id, address_id, actual_delivery_date)
				VALUES (${order.order_id}, ${order.order_date.toISOString().slice(0, 10)}, ${order.status}, ${order.estimated_delivery_date.toISOString().slice(0, 10)}, ${order.user_id}, ${order.payment_info_id}, ${order.address_id}, ${order.actual_delivery_date?.toISOString().slice(0, 10) ?? null})
				ON CONFLICT (order_id) DO NOTHING;
			`;
		})
	);
};

const seedProducts = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await sql`
		CREATE TABLE IF NOT EXISTS Products (
			product_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT NOT NULL,
			price REAL NOT NULL,
			user_id UUID NOT NULL REFERENCES Users,
			stock_quantity INTEGER NOT NULL
		);
	`;
	return await Promise.all(
		products.map(async (product) => {
			return sql`
				INSERT INTO Products (product_id, name, description, price, user_id, stock_quantity)
				VALUES (${product.product_id}, ${product.name}, ${product.description}, ${product.price}, ${product.user_id}, ${product.stock_quantity})
				ON CONFLICT (product_id) DO NOTHING;
			`;
		})
	);
};

const seedOrderItems = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await sql`
		CREATE TABLE IF NOT EXISTS OrderItems (
			order_item_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			order_id UUID NOT NULL REFERENCES Orders,
			product_id UUID NOT NULL REFERENCES Products,
			quantity INTEGER NOT NULL
		);
	`;
	return await Promise.all(
		orderItems.map(async (orderItem) => {
			return sql`
				INSERT INTO OrderItems (order_item_id, order_id, product_id, quantity)
				VALUES (${orderItem.order_item_id}, ${orderItem.order_id}, ${orderItem.product_id}, ${orderItem.quantity})
				ON CONFLICT (order_item_id) DO NOTHING;
			`;
		})
	);
};

const seedCategories = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await sql`
		CREATE TABLE IF NOT EXISTS Categories (
			category_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT NOT NULL
		);
	`;
	return await Promise.all(
		categories.map(async (category) => {
			return sql`
				INSERT INTO Categories (category_id, name, description)
				VALUES (${category.category_id}, ${category.name}, ${category.description})
				ON CONFLICT (category_id) DO NOTHING;
			`;
		})
	);
};

const seedProductCategories = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await sql`
		CREATE TABLE IF NOT EXISTS ProductCategories (
			product_category_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			product_id UUID NOT NULL REFERENCES Products,
			category_id UUID NOT NULL REFERENCES Categories
		);
	`;
	return await Promise.all(
		productCategories.map(async (productCategory) => {
			return sql`
				INSERT INTO ProductCategories (product_category_id, product_id, category_id)
				VALUES (${productCategory.product_category_id}, ${productCategory.product_id}, ${productCategory.category_id})
				ON CONFLICT (product_category_id) DO NOTHING;
			`;
		})
	);
};

const seedReviews = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
	await sql`
		CREATE TABLE IF NOT EXISTS Reviews (
			review_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			rating INTEGER NOT NULL,
			comment TEXT NOT NULL,
			date_submitted DATE NOT NULL,
			user_id UUID NOT NULL REFERENCES Users
		);
	`;
	return await Promise.all(
		reviews.map(async (review) => {
			return sql`
				INSERT INTO Reviews (review_id, rating, comment, date_submitted, user_id)
				VALUES (${review.review_id}, ${review.rating}, ${review.comment}, ${review.date_submitted.toISOString().slice(0, 10)}, ${review.user_id})
				ON CONFLICT (review_id) DO NOTHING;
			`;
		})
	);
};

export const GET = async () => {
	try {
		await sql`BEGIN`;
		await seedUsers();
		await seedAddresses();
		await seedPaymentInfos();
		await seedOrders();
		await seedProducts();
		await seedOrderItems();
		await seedCategories();
		await seedProductCategories();
		await seedReviews();
		await sql`COMMIT`;

		return Response.json({ message: "Database seeded successfully." });
	} catch (error) {
		await sql`ROLLBACK`;

		return Response.json({ error }, { status: 500 });
	}
};

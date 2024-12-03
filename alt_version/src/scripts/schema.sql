-- This schema is designed to be used with PostgreSQL.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS Users (
	user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	phone TEXT NOT NULL UNIQUE
);

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

CREATE TABLE IF NOT EXISTS PaymentInfos (
	payment_info_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id UUID NOT NULL REFERENCES Users,
	method TEXT NOT NULL,
	card_number TEXT NOT NULL,
	card_holder_name TEXT NOT NULL,
	expiration_date DATE NOT NULL,
	address_id UUID NOT NULL REFERENCES Addresses
);

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

CREATE TABLE IF NOT EXISTS Products (
	product_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	price REAL NOT NULL,
	user_id UUID NOT NULL REFERENCES Users,
	stock_quantity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS OrderItems (
	order_item_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	order_id UUID NOT NULL REFERENCES Orders,
	product_id UUID NOT NULL REFERENCES Products,
	quantity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Categories (
	category_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ProductCategories (
	product_category_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	product_id UUID NOT NULL REFERENCES Products,
	category_id UUID NOT NULL REFERENCES Categories
);

CREATE TABLE IF NOT EXISTS Reviews (
	review_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	rating INTEGER NOT NULL,
	comment TEXT NOT NULL,
	date_submitted DATE NOT NULL,
	user_id UUID NOT NULL REFERENCES Users
);

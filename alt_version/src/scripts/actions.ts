"use server";

import {
	createAddress,
	createOrder,
	createOrderItem,
	createPaymentInfo,
	createUser
} from "./db";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { signIn } from "../middleware";

export const signUp = async (_: string | undefined, formData: FormData) => {
	const email = formData.get("email");
	if (typeof email !== "string") {
		return "The email address field is required.";
	}

	const name = formData.get("name");
	if (typeof name !== "string") {
		return "The name field is required.";
	}

	const phone = formData.get("phone");
	if (typeof phone !== "string") {
		return "The phone number field is required.";
	}

	try {
		// eslint-disable-next-line camelcase
		await createUser({ email, name, phone, user_id: "" });
	} catch (error) {
		if (error instanceof Error) {
			return `Something went wrong: ${error.toString()}`;
		}

		return "Something went wrong.";
	}

	return "Success!";
};

export const createAddressFromForm = async (
	_: string | undefined,
	formData: FormData
) => {
	// eslint-disable-next-line camelcase
	const user_id = formData.get("user_id");
	// eslint-disable-next-line camelcase
	const is_shipping = formData.get("is_shipping");
	// eslint-disable-next-line camelcase
	const street_address = formData.get("street_address");
	const city = formData.get("city");
	const state = formData.get("state");
	// eslint-disable-next-line camelcase
	const postal_code = formData.get("postal_code");
	const country = formData.get("country");
	if (
		// eslint-disable-next-line camelcase
		typeof user_id !== "string" ||
		// eslint-disable-next-line camelcase
		typeof is_shipping !== "string" ||
		// eslint-disable-next-line camelcase
		typeof street_address !== "string" ||
		typeof city !== "string" ||
		typeof state !== "string" ||
		// eslint-disable-next-line camelcase
		typeof postal_code !== "string" ||
		typeof country !== "string"
	) {
		return "A required field was missing.";
	}

	try {
		// eslint-disable-next-line camelcase
		await createAddress({
			// eslint-disable-next-line camelcase
			address_id: "",
			city,
			country,
			// eslint-disable-next-line camelcase
			is_shipping: is_shipping === "on",
			// eslint-disable-next-line camelcase
			postal_code,
			state,
			// eslint-disable-next-line camelcase
			street_address,
			// eslint-disable-next-line camelcase
			user_id
		});
	} catch (error) {
		if (error instanceof Error) {
			return `Something went wrong: ${error.toString()}`;
		}

		return "Something went wrong.";
	}

	return "Success!";
};

export const createPaymentInfoFromForm = async (
	_: string | undefined,
	formData: FormData
) => {
	// eslint-disable-next-line camelcase
	const user_id = formData.get("user_id");
	const method = formData.get("method");
	// eslint-disable-next-line camelcase
	const card_number = formData.get("card_number");
	// eslint-disable-next-line camelcase
	const card_holder_name = formData.get("card_holder_name");
	// eslint-disable-next-line camelcase
	const expiration_date = formData.get("expiration_date");
	// eslint-disable-next-line camelcase
	const address_id = formData.get("address_id");
	if (
		// eslint-disable-next-line camelcase
		typeof user_id !== "string" ||
		typeof method !== "string" ||
		// eslint-disable-next-line camelcase
		typeof card_number !== "string" ||
		// eslint-disable-next-line camelcase
		typeof card_holder_name !== "string" ||
		// eslint-disable-next-line camelcase
		typeof expiration_date !== "string" ||
		// eslint-disable-next-line camelcase
		typeof address_id !== "string"
	) {
		return "A required field was missing.";
	}

	try {
		// eslint-disable-next-line camelcase
		await createPaymentInfo({
			// eslint-disable-next-line camelcase
			address_id,
			// eslint-disable-next-line camelcase
			card_holder_name,
			// eslint-disable-next-line camelcase
			card_number,
			// eslint-disable-next-line camelcase
			expiration_date: new Date(expiration_date),
			method,
			// eslint-disable-next-line camelcase
			payment_info_id: "",
			// eslint-disable-next-line camelcase
			user_id
		});
	} catch (error) {
		if (error instanceof Error) {
			return `Something went wrong: ${error.toString()}`;
		}

		return "Something went wrong.";
	}

	return "Success!";
};

export const createOrderFromForm = async (
	_: string | undefined,
	formData: FormData
) => {
	// eslint-disable-next-line camelcase
	const user_id = formData.get("user_id");
	// eslint-disable-next-line camelcase
	const product_id = formData.get("product_id");
	// eslint-disable-next-line camelcase
	const payment_info_id = formData.get("payment_info_id");
	// eslint-disable-next-line camelcase
	const address_id = formData.get("address_id");
	const quantity = formData.get("quantity");
	if (
		// eslint-disable-next-line camelcase
		typeof user_id !== "string" ||
		// eslint-disable-next-line camelcase
		typeof product_id !== "string" ||
		// eslint-disable-next-line camelcase
		typeof payment_info_id !== "string" ||
		// eslint-disable-next-line camelcase
		typeof address_id !== "string" ||
		typeof quantity !== "string"
	) {
		return "A required field was missing.";
	}

	try {
		const order = await createOrder({
			// eslint-disable-next-line camelcase
			address_id,
			// eslint-disable-next-line camelcase
			estimated_delivery_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
			// eslint-disable-next-line camelcase
			order_date: new Date(),
			// eslint-disable-next-line camelcase
			order_id: "",
			// eslint-disable-next-line camelcase
			payment_info_id,
			status: "Pending",
			// eslint-disable-next-line camelcase
			user_id
		});

		if (!order) {
			return "Failed to create an order.";
		}

		await createOrderItem({
			// eslint-disable-next-line camelcase
			order_id: order.order_id,
			// eslint-disable-next-line camelcase
			order_item_id: "",
			// eslint-disable-next-line camelcase
			product_id,
			quantity: parseInt(quantity, 10)
		});
	} catch (error) {
		if (error instanceof Error) {
			return `Something went wrong: ${error.toString()}`;
		}

		return "Something went wrong.";
	}

	return "Success!";
};

export const authenticate = async (
	_: string | undefined,
	formData: FormData
) => {
	try {
		await signIn("credentials", formData);
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		if (error instanceof AuthError && error.type === "CredentialsSignin") {
			return "Invalid credentials.";
		}

		if (error instanceof Error) {
			return `Something went wrong: ${error.toString()}`;
		}

		return "Something went wrong.";
	}

	return "Success!";
};

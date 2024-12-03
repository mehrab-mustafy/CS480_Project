import auth, { signOut } from "../../middleware";
import {
	createAddressFromForm,
	createPaymentInfoFromForm
} from "../../scripts/actions";
import {
	getAddressesByUserId,
	getPaymentInfosByUserId,
	getUserByEmail
} from "../../scripts/db";

export default async function Page() {
	const session = await auth();
	const user =
		session?.user?.email && (await getUserByEmail(session.user.email));

	return (
		<>
			<h1>{"Dashboard"}</h1>
			<hr />
			{user ? (
				<>
					<p>
						<strong>{"Name:"}</strong> {user.name}
					</p>
					<p>
						<strong>{"Email address:"}</strong> {user.email}
					</p>
					<p>
						<strong>{"Phone number:"}</strong> {user.phone}
					</p>
					<p>
						<strong>{"ID:"}</strong> {user.user_id}
					</p>
					<form
						action={async () => {
							"use server";
							await signOut();
						}}
					>
						<input type="submit" value="Log Out" />
					</form>
					<h2>{"Addresses"}</h2>
					<hr />
					{(await getAddressesByUserId(user.user_id)).map((address) => (
						<p key={address.address_id}>
							<strong>
								{address.is_shipping ? "Shipping" : "Billing"}
								{" address "}
								{address.address_id}:
							</strong>{" "}
							{address.street_address}
							{" // "}
							{address.city}
							{", "}
							{address.state} {address.postal_code}
							{" // "}
							{address.country}
						</p>
					))}
					<h3>{"Add New"}</h3>
					<form
						action={async (formData: FormData) => {
							"use server";
							await createAddressFromForm(void 0, formData);
						}}
					>
						<label htmlFor="is_shipping">{"Is shipping address: "}</label>
						<input type="checkbox" id="is_shipping" name="is_shipping" />
						<br />
						<label htmlFor="street_address">{"Street address: "}</label>
						<input
							type="text"
							id="street_address"
							name="street_address"
							placeholder="1 First Street"
							required
						/>
						<br />
						<label htmlFor="city">{"City: "}</label>
						<input
							type="text"
							id="city"
							name="city"
							placeholder="New York"
							required
						/>
						<br />
						<label htmlFor="state">{"State: "}</label>
						<input
							type="text"
							id="state"
							name="state"
							placeholder="New York"
							required
						/>
						<br />
						<label htmlFor="postal_code">{"Postal code: "}</label>
						<input
							type="text"
							id="postal_code"
							name="postal_code"
							placeholder="10001"
							required
						/>
						<br />
						<label htmlFor="country">{"Country: "}</label>
						<input
							type="text"
							id="country"
							name="country"
							placeholder="United States"
							required
						/>
						<br />
						<input
							type="hidden"
							id="user_id"
							name="user_id"
							value={user.user_id}
						/>
						<input type="submit" value="Create Address" />
					</form>
					<h2>{"Payment Information"}</h2>
					<hr />
					{(await getPaymentInfosByUserId(user.user_id)).map((paymentInfo) => (
						<p key={paymentInfo.payment_info_id}>
							<strong>
								{paymentInfo.method} {paymentInfo.payment_info_id}
							</strong>
						</p>
					))}
					<h3>{"Add New"}</h3>
					<form
						action={async (formData: FormData) => {
							"use server";
							await createPaymentInfoFromForm(void 0, formData);
						}}
					>
						<label htmlFor="method">{"Method: "}</label>
						<input
							type="text"
							id="method"
							name="method"
							placeholder="Credit Card"
							required
						/>
						<br />
						<label htmlFor="card_number">{"Card number: "}</label>
						<input
							type="text"
							id="card_number"
							name="card_number"
							placeholder="0123 4567 8901 2345"
							required
						/>
						<br />
						<label htmlFor="card_holder_name">{"Card holder name: "}</label>
						<input
							type="text"
							id="card_holder_name"
							name="card_holder_name"
							placeholder="John Doe"
							required
						/>
						<br />
						<label htmlFor="expiration_date">{"Expiration date: "}</label>
						<input
							type="date"
							id="expiration_date"
							name="expiration_date"
							placeholder="03-13-2021"
							required
						/>
						<br />
						<label htmlFor="address_id">{"Billing address ID: "}</label>
						<input
							type="text"
							id="address_id"
							name="address_id"
							placeholder="United States"
							required
						/>
						<br />
						<input
							type="hidden"
							id="user_id"
							name="user_id"
							value={user.user_id}
						/>
						<input type="submit" value="Create Payment Information" />
					</form>
				</>
			) : (
				<p>{"Not logged in."}</p>
			)}
		</>
	);
}

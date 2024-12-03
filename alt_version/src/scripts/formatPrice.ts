const formatter = new Intl.NumberFormat("en-US", {
	currency: "USD",
	style: "currency",
	trailingZeroDisplay: "stripIfInteger"
});

export default function formatPrice(
	price: number | bigint | Intl.StringNumericLiteral
) {
	return formatter.format(price);
}

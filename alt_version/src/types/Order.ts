export interface Order {
	order_id: string;
	order_date: Date;
	status: string;
	estimated_delivery_date: Date;
	user_id: string;
	payment_info_id: string;
	address_id: string;
	actual_delivery_date?: Date;
}

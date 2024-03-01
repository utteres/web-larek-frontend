import _ from 'lodash';
import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	IProduct,
	IOrder,
	IOrderForm,
} from '../types/types';

export type CatalogChangeEvent = {
	catalog: ProductItem[];
};

export class ProductItem extends Model<IProduct> {
	description: string;
	id: string;
	image: string;
	title: string;
	price: number;
	category: string;
}

export class AppState extends Model<IAppState> {
	basket: string[];
	catalog: ProductItem[];
	loading: boolean;
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		items: [],
		total: null,
		payment: null,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	toggleOrderedProduct(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}

	clearBasket() {
		this.order.items.forEach((id) => {
			this.toggleOrderedProduct(id, false);
		});
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(payment: keyof IOrderForm, value: 'online' | 'offline' | null) {
		this.order[payment] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	getProducts(): ProductItem[] {
		return this.catalog;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address || this.order.payment === null) {
			errors.address = 'Необходимо указать адрес';
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}

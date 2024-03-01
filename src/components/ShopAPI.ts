import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderResult, IProduct } from '../types/types';
import { Contacts } from './Contacts';

export interface IShopAPI {
	getProductList: () => Promise<IProduct[]>; // получаем не полное описание
	getProductItem: (id: string) => Promise<IProduct>; // получаем объекты с полным описание
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}

export class ShopAPI extends Api implements IShopAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProduct(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
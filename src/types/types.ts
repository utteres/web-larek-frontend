import { Product } from '../components/AppData';

export type CategoryType = "софт-скил"|"другое"|"хард-скил"| "дополнительное" | "кнопка"
export type CategoryObjectType={
	[key in CategoryType]: string
}
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
export interface ApiResponse {
  items: IProduct[];
}

export const CategoryObject: CategoryObjectType = {
	'другое': 'card__category_other',
	'софт-скил': 'card__category_soft',
	'дополнительное': 'card__category_additional',
	'кнопка': 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export interface ICard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}


export interface IProduct extends ICard{
  category: CategoryType;
}


export interface IAppState {

  basket: Product[];
  store: Product[];
  order: IOrder;
  formErrors: FormErrors;

  addToBasket(value: Product): void;
  deleteProductBasket(id: string): void;
  clearBasket(): void;
  setItems(): void;
  setOrderField(field: keyof IOrderForm, value: string): void;
  getBasketCount(): number;
  getTotalPrice(): number;
  validateContacts(): boolean;
  validateOrder(): boolean;
  isValidEmail(email: string): boolean;
  isValidPhone(phone: string): boolean;
  refreshOrder(): boolean;
  setStore(items: IProduct[]): void;
  resetSelected(): void;
  
}

export interface IOrder {
  items: string[];
  payment: string;
  total: number;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}
